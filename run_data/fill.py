import pandas as pd
import psycopg2
from psycopg2 import sql

# Database connection parameters
db_params = {
    'host': 'localhost',
    'port': '5432',
    'dbname': 'triprecommender',
    'user': 'postgres',
    'password': 'root'
}

# Function to connect to the PostgreSQL database
def connect_db():
    conn = psycopg2.connect(**db_params)
    return conn

# Function to insert data into the database table
def insert_data_from_csv(csv_file):
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file)
    
    # Connect to the PostgreSQL database
    conn = connect_db()
    cursor = conn.cursor()

    # Define the SQL INSERT query template
    insert_query = """
        INSERT INTO listing (id, id_ref, name, type, type_service, location, price)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    try:
        # Iterate through the rows of the DataFrame and insert each row into the table
        for _, row in df.iterrows():
            cursor.execute(insert_query, (
                row['id'],
                row['id_ref'],
                row['name'],
                row['type'],
                row['type_service'],
                row['location'],
                row['price']
            ))

        # Commit the transaction to the database
        conn.commit()
        print(f"Data inserted successfully from {csv_file}.")

    except Exception as e:
        # Rollback the transaction in case of an error
        conn.rollback()
        print(f"Error inserting data: {e}")

    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

# Main function to run the script
if __name__ == "__main__":
    csv_file = './combined_services.csv'  # Path to your CSV file
    insert_data_from_csv(csv_file)
