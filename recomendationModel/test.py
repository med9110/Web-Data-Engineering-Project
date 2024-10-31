from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from surprise import Dataset, Reader, SVD

app = FastAPI()

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
    city_options = options_data[options_data['location'].str.lower() == city.lower()]
    city_activity_ids = city_options['id'].unique()

    rated_activity_ids = user_ratings[(user_ratings['user_id'] == user_id) & 
                                      (user_ratings['activity_id'].isin(city_activity_ids))]['activity_id']
    unrated_activity_ids = [activity_id for activity_id in city_activity_ids if activity_id not in rated_activity_ids.values]

    predictions = [algo.predict(user_id, activity_id) for activity_id in unrated_activity_ids]
    predictions.sort(key=lambda x: x.est, reverse=True)

    top_hotel = city_options[(city_options['type'] == 'hotel') & (city_options['id'].isin(unrated_activity_ids))].head(1)
    top_restaurants = [pred for pred in predictions if city_options.loc[city_options['id'] == pred.iid, 'type'].values[0] == 'restaurant'][:5]
    top_activities = [pred for pred in predictions if city_options.loc[city_options['id'] == pred.iid, 'type'].values[0] == 'activity'][:3]

    recommended_hotel = top_hotel[['name', 'price']].to_dict(orient='records') if not top_hotel.empty else []
    recommended_restaurants = city_options[city_options['id'].isin([pred.iid for pred in top_restaurants])][['name', 'price']].head(5).to_dict(orient='records')
    recommended_activities = city_options[city_options['id'].isin([pred.iid for pred in top_activities])][['name', 'price']].head(3).to_dict(orient='records')

    return {
        'hotel': recommended_hotel,
        'restaurants': recommended_restaurants,
        'activities': recommended_activities
    }

@app.post('/recommendations')
async def get_recommendations_endpoint(request: UserRequest):
    recommendations = get_recommendations(request.user_id, request.city)
    return recommendations

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
