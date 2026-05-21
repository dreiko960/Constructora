import mysql.connector
from app.db.session import engine, Base
from app.models import models

def check_db_and_create_tables():
    db_name = "constructora_bd"
    try:
        # Check if database exists
        conn = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="root",
            port=3306
        )
        cursor = conn.cursor()
        cursor.execute(f"SHOW DATABASES LIKE '{db_name}'")
        result = cursor.fetchone()
        
        if result:
            print(f"Base de datos '{db_name}' encontrada.")
            # Create tables using SQLAlchemy
            print("Creando tablas...")
            models.Base.metadata.create_all(bind=engine)
            print("Tablas creadas exitosamente.")
        else:
            print(f"Error: La base de datos '{db_name}' no existe. Por favor, créala manualmente.")
        
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error de conexión: {err}")

if __name__ == "__main__":
    check_db_and_create_tables()
