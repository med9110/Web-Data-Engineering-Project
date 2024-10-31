from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from surprise import Dataset, Reader, SVD

app = FastAPI()

# Load datasets
options_data = pd.read_csv('options_data.csv')
users_data = pd.read_csv('users_data.csv')
user_ratings = pd.read_csv('user_ratings.csv')

# Prepare the data for Surprise
reader = Reader(rating_scale=(user_ratings['rating'].min(), user_ratings['rating'].max()))
data = Dataset.load_from_df(user_ratings[['user_id', 'activity_id', 'rating']], reader)
trainset = data.build_full_trainset()

# Build the SVD model
algo = SVD()
algo.fit(trainset)

class UserRequest(BaseModel):
    user_id: int
    city: str

def get_recommendations(user_id, city):
    # Filter options based on the specified city
    city_options = options_data[options_data['location'].str.lower() == city.lower()]

    # Get all activity IDs in the specified city
    city_activity_ids = city_options['id'].unique()

    # Get the activity IDs that the user has rated in the city
    rated_activity_ids = user_ratings[(user_ratings['user_id'] == user_id) & 
                                       (user_ratings['activity_id'].isin(city_activity_ids))]['activity_id']

    # Identify unrated activities in the specified city
    unrated_activity_ids = [activity_id for activity_id in city_activity_ids if activity_id not in rated_activity_ids.values]

    # Predict ratings for unrated activities in the specified city
    predictions = [algo.predict(user_id, activity_id) for activity_id in unrated_activity_ids]

    # Sort predictions by estimated rating
    predictions.sort(key=lambda x: x.est, reverse=True)

    # Get the top predicted hotel (assumed to be the first predicted hotel)
    top_hotel = city_options[(city_options['type'] == 'hotel') & (city_options['id'].isin(unrated_activity_ids))].head(1)

    # Get the top 5 predicted restaurants
    top_restaurants = [pred for pred in predictions if city_options.loc[city_options['id'] == pred.iid, 'type'].values[0] == 'restaurant'][:5]

    # Get the top 3 predicted activities
    top_activities = [pred for pred in predictions if city_options.loc[city_options['id'] == pred.iid, 'type'].values[0] == 'activity'][:3]

    # Format recommendations for output
    recommended_hotel = top_hotel[['name', 'price']].to_string(index=False) if not top_hotel.empty else "No hotel found."
    recommended_restaurants = city_options[city_options['id'].isin([pred.iid for pred in top_restaurants])][['name', 'price']].head(5).to_string(index=False)
    recommended_activities = city_options[city_options['id'].isin([pred.iid for pred in top_activities])][['name', 'price']].head(3).to_string(index=False)

    return recommended_hotel, recommended_restaurants, recommended_activities

@app.post('/recommendations')
async def get_recommendations_endpoint(request: UserRequest):
    user_id = request.user_id
    city = request.city
    
    # Call your recommendation function
    recommended_hotel, recommended_restaurants, recommended_activities = get_recommendations(user_id, city)

    return {
        'hotel': recommended_hotel,
        'restaurants': recommended_restaurants,
        'activities': recommended_activities
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
