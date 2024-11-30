import psycopg2
import csv

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    dbname="tripadvisor_clone",
    user="postgres",
    password="yazid",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Create a new table 'combined_services' to store unified data
cursor.execute('''
CREATE TABLE IF NOT EXISTS combined_services (
    id SERIAL PRIMARY KEY,
    id_ref TEXT,
    name TEXT,
    type TEXT,
    type_service TEXT,
    location TEXT,
    price REAL
)
''')

# Function to populate 'combined_services' table
def populate_combined_services():
    # Query to combine data with id_ref
    query = """
    SELECT 'H-' || id::TEXT AS id_ref, name, type, 'Hébergement' AS type_service, location, price_per_night AS price
    FROM Hébergement
    UNION ALL
    SELECT 'R-' || id::TEXT AS id_ref, name, type, 'Restauration' AS type_service, location, average_price_per_person AS price
    FROM Restauration
    UNION ALL
    SELECT 'A-' || id::TEXT AS id_ref, name, type, 'Activités' AS type_service, location, price_per_person AS price
    FROM Activités
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    # Insert combined data into 'combined_services' table
    cursor.executemany('''
    INSERT INTO combined_services (id_ref, name, type, type_service, location, price)
    VALUES (%s, %s, %s, %s, %s, %s)''', rows)

# Function to export 'combined_services' table to a CSV file
def export_combined_services_to_csv(filename):
    cursor.execute("SELECT * FROM combined_services")
    rows = cursor.fetchall()
    headers = [desc[0] for desc in cursor.description]

    # Write data to CSV
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)  # Write headers
        writer.writerows(rows)    # Write data

# Populate and export data
populate_combined_services()
export_combined_services_to_csv('combined_services.csv')

# Commit changes and close the database connection
conn.commit()
conn.close()

print("Data combined into 'combined_services' table and exported to 'combined_services.csv'.")
