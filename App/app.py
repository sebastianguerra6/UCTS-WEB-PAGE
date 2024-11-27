import pandas as pd
from itertools import combinations

try:
    # Cargar archivo Excel
    df = pd.read_excel('./src/Palabras Claves Version 10-08-2024.xlsx')
except FileNotFoundError:
    print("Error: El archivo no fue encontrado. Verifique la ruta y el nombre del archivo.")
    exit(1)
except Exception as e:
    print(f"Error al cargar el archivo Excel: {e}")
    exit(1)

try:
    # Filtrar filas donde 'Resultado' sea mayor a 0
    filtered_df = df[df['Resultado'] > 0]

    # Crear un diccionario para almacenar las combinaciones
    combinaciones_por_LineasDeinvestigacion = {}

    # Lista para almacenar todas las combinaciones
    todas_combinaciones = []

    # Iterar sobre los investigadores únicos
    for investigador, grupo in filtered_df.groupby('Líneas de investigación'):
        # Extraer las palabras (columna 'Words') de cada investigador
        palabras = grupo['Words'].tolist()
        
        # Generar combinaciones de las palabras (pares, tríos, etc.)
        combinaciones = list(combinations(palabras, 2))  
        
        # Guardar las combinaciones en una lista
        todas_combinaciones.extend(combinaciones)

    # Crear un DataFrame con las combinaciones
    df_combinaciones = pd.DataFrame(todas_combinaciones, columns=['Word1', 'Word2'])

    # Unir las palabras combinadas en una sola columna llamada "Word"
    df_combinaciones['Word'] = '"' + df_combinaciones['Word1'] + '"' + " " + '"' + df_combinaciones['Word2'] + '"'

    # Eliminar las columnas Word1 y Word2, dejando solo "Word"
    df_combinaciones = df_combinaciones[['Word']]
    
except KeyError as e:
    print(f"Error: Columna faltante en el archivo Excel: {e}")
    exit(1)
except Exception as e:
    print(f"Error al procesar los datos: {e}")
    exit(1)

try:
    # Guardar el DataFrame en un archivo Excel y CSV
    df_combinaciones.to_excel('src/combinaciones_palabras.xlsx', index=False)
    df_combinaciones.to_csv('src/combinaciones_palabras.csv', index=False)
    print("Combinaciones guardadas en el archivo combinaciones_palabras.xlsx")
    print("Combinaciones guardadas en el archivo combinaciones_palabras.csv")
except PermissionError:
    print("Error: No se pudo guardar los archivos. Verifique los permisos de escritura en la carpeta destino.")
except Exception as e:
    print(f"Error al guardar los archivos: {e}")
