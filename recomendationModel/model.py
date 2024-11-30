from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from datetime import datetime

# Load datasets
options_data = pd.read_csv('options_data.csv')
users_data = pd.read_csv('users_data.csv')
user_ratings = pd.read_csv('user_ratings.csv')

# Prepare the data for Surprise
reader = Reader(rating_scale=(user_ratings['rating'].min(), user_ratings['rating'].max()))
data = Dataset.load_from_df(user_ratings[['user_id', 'activity_id', 'rating']], reader)

# Split the data into train and test
trainset, testset = train_test_split(data, test_size=0.25)

# Build the SVD model
algo = SVD()
algo.fit(trainset)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify a list of allowed origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Request body model
class RecommendationRequest(BaseModel):
    age: int
    preference: str
    city: str
    check_in_date: str
    check_out_date: str
    budget: float

# Function to calculate nights
def calculate_nights(check_in_date, check_out_date):
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    return (check_out - check_in).days

# Function to get similar users based on age and preference
def get_similar_users(users_data, age, preference):
    similar_users = users_data[(users_data['age'] == age) & (users_data['preferences'].str.contains(preference, case=False))]
    return similar_users['user_id'].unique()

# Function to get recommendations within budget
def get_recommendations(age, preference, city, check_in_date, check_out_date, budget):
    city_options = options_data[options_data['location'].str.lower() == city.lower()]
    similar_user_ids = get_similar_users(users_data, age, preference)
    
    similar_ratings = user_ratings[user_ratings['user_id'].isin(similar_user_ids)]
    highly_rated_activities = similar_ratings[similar_ratings['rating'] >= 4]['activity_id'].unique()
    
    nights = calculate_nights(check_in_date, check_out_date)
    predictions = [algo.predict(0, activity_id) for activity_id in highly_rated_activities if activity_id in city_options['id'].values]
    predictions.sort(key=lambda x: x.est, reverse=True)
    
    hotel_options = city_options[(city_options['type'] == 'hotel') & (city_options['id'].isin(highly_rated_activities))]
    restaurant_options = city_options[(city_options['type'] == 'restaurant') & (city_options['id'].isin(highly_rated_activities))]
    activity_options = city_options[(city_options['type'] == 'activity') & (city_options['id'].isin(highly_rated_activities))]

    recommended_hotel = None
    recommended_restaurants = []
    recommended_activities = []
    
    # Modify this section to include the total hotel cost
    for _, hotel in hotel_options.iterrows():
        hotel_total_cost = hotel['price'] * nights
        if hotel_total_cost <= budget:
            recommended_hotel = hotel.to_dict()
            recommended_hotel['total_cost'] = f"{hotel_total_cost:.2f}"  # Format total cost as a string with currency
            budget -= hotel_total_cost
            # break
    
    for _, restaurant in restaurant_options.iterrows():
        if restaurant['price'] <= budget:
            recommended_restaurants.append(restaurant.to_dict())
            budget -= restaurant['price']
    
    for _, activity in activity_options.iterrows():
        if activity['price'] <= budget:
            recommended_activities.append(activity.to_dict())
            budget -= activity['price']
    
    return {
        "hotel": recommended_hotel if recommended_hotel is not None else None,
        "restaurants": recommended_restaurants,
        "activities": recommended_activities
    }

@app.post("/recommendations/")
async def recommend(request: RecommendationRequest):
    try:
        recommendations = get_recommendations(
            request.age,
            request.preference,
            request.city,
            request.check_in_date,
            request.check_out_date,
            request.budget
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
# Use the command: uvicorn your_script_name:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
