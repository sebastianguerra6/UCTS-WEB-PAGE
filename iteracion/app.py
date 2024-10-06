import pandas as pd
from itertools import combinations

# Cargar archivo Excel
df = pd.read_excel('./src/Palabras Claves Version 10-08-2024.xlsx')

# Filtrar filas donde 'Resultado' sea mayor a 0
filtered_df = df[df['Resultado'] > 0]

# Crear un diccionario para almacenar las combinaciones
combinaciones_por_investigador = {}

# Lista para almacenar todas las combinaciones
todas_combinaciones = []

# Iterar sobre los investigadores únicos
for investigador, grupo in filtered_df.groupby('Investigador'):
    # Extraer las palabras (columna 'Words') de cada investigador
    palabras = grupo['Words'].tolist()
    
    # Generar combinaciones de las palabras (pares, tríos, etc.)
    combinaciones = list(combinations(palabras, 2))  # Puedes cambiar el número 2 por el número de elementos en la combinación que desees
    
    # Guardar las combinaciones en una lista
    todas_combinaciones.extend(combinaciones)

# Crear un DataFrame con las combinaciones
df_combinaciones = pd.DataFrame(todas_combinaciones, columns=['Word1', 'Word2'])

# Unir las palabras combinadas en una sola columna llamada "Word"
df_combinaciones['Word'] ='"' + df_combinaciones['Word1']+'"' +" "+ '"'+ df_combinaciones['Word2']+ '"'

# Eliminar las columnas Word1 y Word2, dejando solo "Word"
df_combinaciones = df_combinaciones[['Word']]

# Guardar el DataFrame en un archivo Excel
df_combinaciones.to_excel('src/combinaciones_palabras.xlsx', index=False)

print("Combinaciones guardadas en el archivo combinaciones_palabras.xlsx")
