import requests
import psycopg2

# Define the base URL and headers
url = "https://tripadvisor-scraper.p.rapidapi.com/restaurants/list"
headers = {
    "x-rapidapi-key": "5c50ef8654mshc95e0993ecd6de3p1bc6a3jsn40e741dccad9",
    "x-rapidapi-host": "tripadvisor-scraper.p.rapidapi.com"
}

# Get user input for the query
query = input("Enter your search query: ")

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="yazid",
    host="localhost",  # Change if using a different host
    port="5432"        # Default PostgreSQL port
)
cursor = conn.cursor()

cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                link TEXT UNIQUE,
                menu_link TEXT,
                rating FLOAT,
                reviews INTEGER,
                price TEXT
                
            );
        """)

# Initialize the querystring with the first page
querystring = {"query": query, "page": "1"}

# Make the first API request
response = requests.get(url, headers=headers, params=querystring)
resp = response.json()

# Retrieve the total number of pages
total_pages = resp.get('total_pages', 1)

# Loop through all pages to collect and store data
for page in range(1, total_pages + 1):
    querystring["page"] = str(page)
    response = requests.get(url, headers=headers, params=querystring)
    resp = response.json()
    
    # Extract the results for the current page
    results = resp.get('results', [])
    for result in results:
        name = result.get("name")
        link = result.get("link")
        menu_link = result.get("menu_link")
        rating = result.get("rating")
        reviews = result.get("reviews")
        price = result.get("price_range_usd")
        
        
        # Insert data into the database, avoiding duplicates
        try:
            cursor.execute("""
                INSERT INTO restaurants (name, link, menu_link, rating, reviews, price)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (link) DO NOTHING;
            """, (name, link, menu_link, rating, reviews, price))
        except Exception as e:
            print(f"Error inserting data: {e}")

# Commit and close the database connection
conn.commit()
cursor.close()
conn.close()

print("Data successfully stored in PostgreSQL.")
