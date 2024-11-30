from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pandas as pd
from datetime import datetime
import psycopg2

# FastAPI app instance
app = FastAPI()

# Database connections
USER_DB_CONFIG = {
    "dbname": "tripadvisor_clone",
    "user": "postgres",
    "password": "yazid",
    "host": "localhost",
    "port": "5432",
}

SERVICE_DB_CONFIG = {
    "dbname": "tripadvisor_clone",
    "user": "postgres",
    "password": "yazid",
    "host": "localhost",
    "port": "5432",
}


def get_current_user():
    # Exemple : Récupération depuis la base de données
    with connect_to_db(USER_DB_CONFIG) as user_conn:
        user_query = "SELECT * FROM users WHERE user_id = %s"
        user_data = pd.read_sql_query(user_query, user_conn, params=(123,))  # Exemple user_id=123
        return user_data.iloc[0].to_dict()  # Retourne les données utilisateur

# Pydantic model for request body validation
class RecommendationRequest(BaseModel):
    age: int
    preference: str
    city: str
    check_in_date: str
    check_out_date: str
    budget: float


# Helper functions
def connect_to_db(config):
    return psycopg2.connect(**config)


def load_data():
    # Load user and service data from PostgreSQL
    with connect_to_db(USER_DB_CONFIG) as user_conn:
        users_data = pd.read_sql_query("SELECT * FROM users", user_conn)

    with connect_to_db(SERVICE_DB_CONFIG) as service_conn:
        options_data = pd.read_sql_query("SELECT * FROM combined_services", service_conn)
        user_ratings = pd.read_sql_query("SELECT * FROM ratings", service_conn)

    return users_data, options_data, user_ratings


def calculate_nights(check_in_date, check_out_date):
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    return (check_out - check_in).days


def get_similar_users(users_data, age, preference):
    similar_users = users_data[
        (users_data['age'] == age) | 
        (users_data['preferences'].str.contains(preference, case=False))
    ]
    return similar_users['user_id'].unique()


def get_recommendations(users_data, options_data, user_ratings, age, preference, city, check_in_date, check_out_date, budget):
    city_options = options_data[options_data['location'].str.lower() == city.lower()]
    similar_user_ids = get_similar_users(users_data, age, preference)
    similar_ratings = user_ratings[user_ratings['user_id'].isin(similar_user_ids)]
    highly_rated_activities = similar_ratings[similar_ratings['rating'] >= 3]['service_id'].unique()
    nights = calculate_nights(check_in_date, check_out_date)
    city_services = city_options[city_options['id'].isin(highly_rated_activities)]

    hotel_options = city_services[city_services['type_service'] == 'Hébergement']
    restaurant_options = city_services[city_services['type_service'] == 'Restauration']
    activity_options = city_services[city_services['type_service'] == 'Activités']

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


# Load data once at startup
users_data, options_data, user_ratings = load_data()


# API endpoint for recommendations
@app.post("/recommendations/")
async def recommend(
    request: RecommendationRequest, 
    current_user: dict = Depends(get_current_user)  # Injection de l'utilisateur authentifié
):
    try:
        # Récupérer l'âge de l'utilisateur depuis les données backend
        user_age = current_user["age"]

        # Appeler la fonction pour obtenir les recommandations
        recommendations = get_recommendations(
            users_data,
            options_data,
            user_ratings,
            user_age,  # L'âge est récupéré côté backend
            request.preference,
            request.city,
            request.check_in_date,
            request.check_out_date,
            request.budget,
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))