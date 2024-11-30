import pandas as pd
from datetime import datetime
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

# Connexions aux bases de données PostgreSQL
user_conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)

service_conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)

# Charger les données dans des DataFrames
users_data = pd.read_sql_query("SELECT * FROM users", user_conn)
options_data = pd.read_sql_query("SELECT * FROM combined_services", service_conn)
user_ratings = pd.read_sql_query("SELECT * FROM ratings", service_conn)

# Fermer les connexions
user_conn.close()
service_conn.close()

# Fonction pour calculer les nuits en fonction des dates
def calculate_nights(check_in_date, check_out_date):
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    return (check_out - check_in).days

# Fonction pour obtenir les utilisateurs similaires en fonction de l'âge et des préférences
def get_similar_users(users_data, age, preference):
    similar_users = users_data[
        (users_data['age'] == age) | 
        (users_data['preferences'].str.contains(preference, case=False))
    ]
    return similar_users['user_id'].unique()

# Fonction pour obtenir des recommandations en fonction du budget
def get_recommendations(age, preference, city, check_in_date, check_out_date, budget):
    # Filtrage des services selon la ville et le type
    city_options = options_data[options_data['location'].str.lower() == city.lower()]
    
    # Obtenir les utilisateurs similaires
    similar_user_ids = get_similar_users(users_data, age, preference)
    
    # Filtrage des évaluations des utilisateurs similaires
    similar_ratings = user_ratings[user_ratings['user_id'].isin(similar_user_ids)]
    
    # Filtrage des activités fortement évaluées (rating >= 4)
    highly_rated_activities = similar_ratings[similar_ratings['rating'] >= 3]['service_id'].unique()
    
    # Calcul du nombre de nuits
    nights = calculate_nights(check_in_date, check_out_date)
    
    # Filtrer les services dans la ville
    city_services = city_options[city_options['id'].isin(highly_rated_activities)]
    
    # Classer les services par prix et recommandation
    hotel_options = city_services[city_services['type_service'] == 'Hébergement']
    restaurant_options = city_services[city_services['type_service'] == 'Restauration']
    activity_options = city_services[city_services['type_service'] == 'Activités']
    
    # Recommandations pour l'hôtel
    recommended_hotel = None
    for _, hotel in hotel_options.iterrows():
        hotel_total_cost = hotel['price'] * nights
        if hotel_total_cost <= budget:
            recommended_hotel = hotel.to_dict()
            recommended_hotel['total_cost'] = f"{hotel_total_cost:.2f}"  # Formater le coût total
            budget -= hotel_total_cost
            print("Hotel:", hotel['name'], "Cost:", hotel_total_cost, "Budget Remaining:", budget)
            break
    
    # Recommandations pour les restaurants
    recommended_restaurants = []
    for _, restaurant in restaurant_options.iterrows():
        if restaurant['price'] <= budget:
            recommended_restaurants.append(restaurant.to_dict())
            budget -= restaurant['price']
    
    # Recommandations pour les activités
    recommended_activities = []
    for _, activity in activity_options.iterrows():
        if activity['price'] <= budget:
            recommended_activities.append(activity.to_dict())
            budget -= activity['price']
    
    # Retourner les recommandations sous forme de dictionnaire
    return {
        "hotel": recommended_hotel if recommended_hotel else None,
        "restaurants": recommended_restaurants,
        "activities": recommended_activities
    }

# Exemple d'utilisation
recommendation_request = {
    "age": 30,
    "preference": "Restauration",
    "city": "Rabat, Morocco",
    "check_in_date": "2024-12-01",
    "check_out_date": "2024-12-05",
    "budget": 1000.00
}

recommended_services = get_recommendations(
    recommendation_request['age'], 
    recommendation_request['preference'],
    recommendation_request['city'],
    recommendation_request['check_in_date'],
    recommendation_request['check_out_date'],
    recommendation_request['budget']
)

print("Recommended Services:")
print(recommended_services)
