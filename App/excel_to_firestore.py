import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase
cred = credentials.Certificate("C:/Users/sague/Desktop/WebScrapping/WebScraping_Finding/ucts-95264-firebase-adminsdk-ltv8f-eb81796ad5.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Leer el archivo Excel
def read_excel(file_path):
    # Cargar datos desde el archivo Excel
    data = pd.read_excel('./src/Palabras Claves Version 10-08-2024.xlsx')
    # Convertir el DataFrame a una lista de diccionarios
    data = data.loc[:, ~data.columns.str.contains('^Unnamed')]

    return data.to_dict(orient="records")

# Subir los datos a Firestore
def upload_to_firestore(collection_name, data):
    for record in data:
        try:
            # Crear un nuevo documento con un ID automático
            db.collection(collection_name).add(record)
            print(f"Documento agregado: {record}")
        except Exception as e:
            print(f"Error al agregar documento: {e}")

# Main
if __name__ == "__main__":
    excel_file = "./src/Palabras Claves Version 10-08-2024.xlsx"  # Reemplaza con la ruta a tu archivo Excel
    collection_name = "palabras-claves"  # Reemplaza con el nombre de tu colección en Firestore

    # Leer y subir datos
    data = read_excel(excel_file)
    upload_to_firestore(collection_name, data)