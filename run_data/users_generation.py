import random
import psycopg2
from faker import Faker
import csv

# Initialize Faker
faker = Faker()

# Sample preferences (categories for user interests)
preferences_categories = [
    "Hébergement",
    "Restauration",
    "Activités",
    "Outdoor Adventures",
    "Cultural Experiences",
    "Workshops",
    "Luxury Stays",
    "Street Food",
    "Family Activities",
    "Solo Travel"
]

# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Create a table for user data
cursor.execute('''
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INTEGER,
    preferences TEXT
)
''')

# Function to generate user data
def generate_users(num_users):
    for _ in range(num_users):
        name = faker.name()
        email = faker.email()
        age = random.randint(18, 75)  # Generate ages between 18 and 75
        preferences = ", ".join(random.sample(preferences_categories, k=random.randint(1, 3)))  # Pick 1-3 preferences randomly

        cursor.execute('''
            INSERT INTO Users (name, email, age, preferences)
            VALUES (%s, %s, %s, %s)''', (name, email, age, preferences))

# Function to export user data to a CSV file
def export_users_to_csv(filename):
    cursor.execute("SELECT * FROM Users")
    rows = cursor.fetchall()
    headers = [desc[0] for desc in cursor.description]

    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)  # Write headers
        writer.writerows(rows)    # Write data

# Generate and export user data
generate_users(300)  # Generate 300 users
export_users_to_csv('users.csv')

# Commit changes and close connection
conn.commit()
conn.close()

print("User data generation complete! Check the file 'users.csv'.")
