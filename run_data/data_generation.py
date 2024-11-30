import random
import psycopg2
from faker import Faker
import csv

# Initialize Faker
faker = Faker()

# List of cities for more realistic locations
cities = [
    "Rabat, Morocco",
    "Casablanca, Morocco",
    "Marrakech, Morocco",
    "Fes, Morocco",
    "Tangier, Morocco",
    "Agadir, Morocco",
    "Oujda, Morocco"
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

# Create tables for services
cursor.execute('''
CREATE TABLE IF NOT EXISTS Hébergement (
    id SERIAL PRIMARY KEY,
    name TEXT,
    type TEXT,
    address TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    price_per_night REAL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Restauration (
    id SERIAL PRIMARY KEY,
    name TEXT,
    type TEXT,
    address TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    average_price_per_person REAL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Activités (
    id SERIAL PRIMARY KEY,
    name TEXT,
    type TEXT,
    address TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    price_per_person REAL
)
''')

# Function to generate realistic data
def generate_data(service, num_entries):
    for _ in range(num_entries):
        name = faker.company()
        address = faker.street_address()
        location = random.choice(cities)
        phone = faker.phone_number()
        email = faker.email()

        if service == 'Hébergement':
            type_ = random.choice(['Hotel', 'Riyad', 'Motel', 'Hostel', 'Guesthouse'])
            price_per_night = round(random.uniform(30, 500), 2)  # Prices from $30 to $500
            cursor.execute('''
                INSERT INTO Hébergement (name, type, address, location, phone, email, price_per_night)
                VALUES (%s, %s, %s, %s, %s, %s, %s)''', (name, type_, address, location, phone, email, price_per_night))

        elif service == 'Restauration':
            type_ = random.choice(['Restaurant', 'Café', 'Bistro', 'Street Food', 'Bakery'])
            average_price_per_person = round(random.uniform(5, 100), 2)  # Prices from $5 to $100
            cursor.execute('''
                INSERT INTO Restauration (name, type, address, location, phone, email, average_price_per_person)
                VALUES (%s, %s, %s, %s, %s, %s, %s)''', (name, type_, address, location, phone, email, average_price_per_person))

        elif service == 'Activités':
            type_ = random.choice(['Tour', 'Outdoor Adventure', 'Cultural Experience', 'Workshop', 'Event'])
            price_per_person = round(random.uniform(0, 200), 2)  # Prices from $0 to $200
            cursor.execute('''
                INSERT INTO Activités (name, type, address, location, phone, email, price_per_person)
                VALUES (%s, %s, %s, %s, %s, %s, %s)''', (name, type_, address, location, phone, email, price_per_person))

# Function to export table data to CSV files
def export_to_csv(table_name, filename):
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    headers = [desc[0] for desc in cursor.description]

    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)  # Write headers
        writer.writerows(rows)    # Write data

# Generate random data for each service
generate_data('Hébergement', 200)
generate_data('Restauration', 200)
generate_data('Activités', 200)

# Export each table to its own CSV file
export_to_csv('Hébergement', 'hebergement.csv')
export_to_csv('Restauration', 'restauration.csv')
export_to_csv('Activités', 'activites.csv')

# Commit changes and close connection
conn.commit()
conn.close()

print("Data generation and export complete! Check the CSV files (hebergement.csv, restauration.csv, activites.csv).")
