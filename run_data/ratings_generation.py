import psycopg2
import csv
import random

# Connect to the PostgreSQL user database
user_conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)
user_cursor = user_conn.cursor()

# Connect to the PostgreSQL tripadvisor database
service_conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)
service_cursor = service_conn.cursor()

# Create a table for ratings in the tripadvisor database
service_cursor.execute('''
CREATE TABLE IF NOT EXISTS Ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    service_id INTEGER,
    rating REAL
)
''')

# Function to generate random ratings
def generate_ratings(num_ratings):
    # Fetch all users and services
    user_cursor.execute("SELECT user_id FROM Users")
    users = [row[0] for row in user_cursor.fetchall()]
    
    service_cursor.execute("SELECT id FROM combined_services")
    services = [row[0] for row in service_cursor.fetchall()]
    
    if not users or not services:
        print("No users or services found. Please ensure both tables are populated.")
        return

    # Generate random ratings
    for _ in range(num_ratings):
        user_id = random.choice(users)  # Random user
        service_id = random.choice(services)  # Random service
        rating = round(random.uniform(1, 5), 1)  # Ratings between 1.0 and 5.0

        service_cursor.execute('''
            INSERT INTO Ratings (user_id, service_id, rating)
            VALUES (%s, %s, %s)''', (user_id, service_id, rating))

# Function to export ratings to a CSV file
def export_ratings_to_csv(filename):
    service_cursor.execute("SELECT * FROM Ratings")
    rows = service_cursor.fetchall()
    headers = [desc[0] for desc in service_cursor.description]

    # Write data to CSV
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)  # Write headers
        writer.writerows(rows)    # Write data

# Generate and export ratings
generate_ratings(400)  # Generate 400 ratings
export_ratings_to_csv('ratings.csv')

# Commit changes and close connections
user_conn.close()
service_conn.commit()
service_conn.close()

print("Ratings generation complete! Check the file 'ratings.csv'.")
