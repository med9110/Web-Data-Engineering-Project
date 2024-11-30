from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from datetime import datetime
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify a list of allowed origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


# Load datasets
users_data = pd.read_csv("users.csv")
options_data = pd.read_csv("combined_services.csv")
user_ratings = pd.read_csv("ratings.csv")

# Prepare data for Surprise
reader = Reader(rating_scale=(user_ratings['rating'].min(), user_ratings['rating'].max()))
data = Dataset.load_from_df(user_ratings[['user_id', 'service_id', 'rating']], reader)

# Train and split model
trainset, testset = train_test_split(data, test_size=0.25)
algo = SVD()
algo.fit(trainset)

# Request body model
class RecommendationRequest(BaseModel):
    age: int
    preferences: list[str]  # Multiple preferences (comma-separated in CSV)
    city: str
    check_in_date: str
    check_out_date: str
    budget: float

# Helper functions
def calculate_nights(check_in_date, check_out_date):
    """Calculate the number of nights between check-in and check-out."""
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    return (check_out - check_in).days

def parse_preferences(preferences):
    """Convert preference string to a list."""
    return [p.strip().lower() for p in preferences.split(",")]

def get_similar_users(users_data, age, preferences):
    """Find users with similar age or overlapping preferences."""
    parsed_preferences = [pref.lower() for pref in preferences]
    users_data['parsed_preferences'] = users_data['preferences'].apply(
        lambda x: [p.strip().lower() for p in str(x).split(",")] if pd.notna(x) else []
    )
    preference_filter = users_data['parsed_preferences'].apply(
        lambda prefs: any(pref in prefs for pref in parsed_preferences)
    )
    similar_users = users_data[(users_data['age'] == age) | preference_filter]
    return similar_users['user_id'].unique()

def get_recommendations(age, preferences, city, check_in_date, check_out_date, budget):
    """Generate recommendations based on user inputs."""
    city_options = options_data[options_data['location'].str.contains(city, case=False, na=False)]
    similar_user_ids = get_similar_users(users_data, age, preferences)
    similar_ratings = user_ratings[user_ratings['user_id'].isin(similar_user_ids)]
    highly_rated_services = similar_ratings[similar_ratings['rating'] >= 4]['service_id'].unique()

    nights = calculate_nights(check_in_date, check_out_date)
    city_services = city_options[city_options['id'].isin(highly_rated_services)]

    hotel_options = city_services[city_services['type_service'].str.lower() == "hébergement"]
    restaurant_options = city_services[city_services['type_service'].str.lower() == "restauration"]
    activity_options = city_services[city_services['type_service'].str.lower() == "activités"]

    # Recommendations
    recommended_hotel = None
    for _, hotel in hotel_options.iterrows():
        hotel_total_cost = hotel['price'] * nights
        if hotel_total_cost <= budget:
            recommended_hotel = hotel.to_dict()
            recommended_hotel['total_cost'] = f"{hotel_total_cost:.2f}"
            budget -= hotel_total_cost
            break

    recommended_restaurants = []
    for _, restaurant in restaurant_options.iterrows():
        if restaurant['price'] <= budget:
            recommended_restaurants.append(restaurant.to_dict())
            budget -= restaurant['price']

    recommended_activities = []
    for _, activity in activity_options.iterrows():
        if activity['price'] <= budget:
            recommended_activities.append(activity.to_dict())
            budget -= activity['price']

    return {
        "hotel": recommended_hotel if recommended_hotel else None,
        "restaurants": recommended_restaurants,
        "activities": recommended_activities,
    }

# Recommendation endpoint
@app.post("/recommendations/")
async def recommend(request: RecommendationRequest):
    """Handle recommendation requests."""
    try:
        recommendations = get_recommendations(
            request.age,
            request.preferences,
            request.city,
            request.check_in_date,
            request.check_out_date,
            request.budget
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
# Command: uvicorn <filename>:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
