// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6unpcJthG1vxG0uGsX3axTJrBSuiOcnY",
    authDomain: "ucts-95264.firebaseapp.com",
    projectId: "ucts-95264",
    storageBucket: "ucts-95264.appspot.com",
    messagingSenderId: "811788165580",
    appId: "1:811788165580:web:30c3e4af5e2c74f611bd69"
};
// Import the functions you need from the SDKs

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para crear una celda de tabla
function createCell(text, editable = false, docId, fieldName) {
    const cell = document.createElement("td");

    if (editable) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        input.addEventListener("blur", async () => {
            // Actualizar el valor de la celda en la tabla
            cell.textContent = input.value;
            
            // Aquí actualizamos el valor en Firestore
            try {
                await updateDocument(docId, fieldName, input.value);  // Llamada a la función que actualizará Firestore
            } catch (error) {
                console.error("Error al actualizar los datos en Firestore:", error);
                // Mostrar un mensaje de error si la actualización falla
                alert("No se pudo actualizar el dato.");
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur(); // Guardar al presionar Enter
            }
        });

        cell.appendChild(input);
    } else {
        cell.textContent = text;
    }

    return cell;
}
// Función para hacer que las celdas de la tabla sean editables
document.querySelector('#data-table').addEventListener('click', function(event) {
    const td = event.target;

    // Verifica si el clic fue en una celda de la tabla
    if (td.tagName === 'TD') {
        const originalText = td.textContent;  // Guarda el contenido original

        // Crear un input para editar el valor
        const input = document.createElement('input');
        input.value = originalText;
        td.textContent = '';  // Elimina el contenido actual de la celda
        td.appendChild(input);  // Añade el input a la celda

        // Cuando el usuario termine de editar (presiona Enter o hace clic fuera)
        input.addEventListener('blur', function() {
            const newValue = input.value;  // Obtiene el nuevo valor

            // Restaura el valor editado a la celda
            td.textContent = newValue;

            // Aquí podrías agregar lógica para actualizar el valor en Firestore si es necesario
        });

        // Opcional: si presionas Enter, también guarda el valor y pierde el foco
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                input.blur();  // Esto dispara el evento de "blur"
            }
        });
    }
});

// Función para obtener los datos filtrados de Firestore
window.getFilteredData = async function getFilteredData() {
    const collectionName = "palabras-claves";
    const selectedOption = document.getElementById("lineas-select").value; // Obtén el valor seleccionado
    const tableBody = document.querySelector("#data-table tbody");
    
    if (!selectedOption) {
        console.warn("Por favor selecciona una línea de investigación.");
        return; // No continuar si no se ha seleccionado una opción
    }

    // Muestra la sección seleccionada en el menú
    mostrarSeccion("opcion1");

    console.log(`Filtrando documentos con "Líneas de investigación" igual a "${selectedOption}"`);

    try {
        // Limpia la tabla antes de insertar nuevos datos
        tableBody.innerHTML = "";

        // Crea la consulta con el filtro
        const q = query(
            collection(db, collectionName),
            where("Líneas de investigación", "==", selectedOption)
        );

        // Ejecuta la consulta
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No se encontraron documentos con esa línea de investigación.");
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.textContent = "No se encontraron datos.";
            noDataCell.colSpan = 7; // Ajusta según tus columnas
            noDataRow.appendChild(noDataCell);
            tableBody.appendChild(noDataRow);
            return;
        }

        // Procesa los documentos encontrados
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Crear una fila para cada documento
            const row = document.createElement("tr");

            // Crear celdas para cada columna
            row.appendChild(createCell(data["Grupo"]));
            row.appendChild(createCell(data["Líneas de investigación"]));
            row.appendChild(createCell(data["Words"]));
            row.appendChild(createCell(data["Resultado"]));
            row.appendChild(createCell(data["Con Filtro de Fecha"]));
            row.appendChild(createCell(data["Con Resultado"]));
            row.appendChild(createCell(data["Con Resultado Fecha"]));

            // Añadir la fila al cuerpo de la tabla
            tableBody.appendChild(row);
            console.log("Fila añadida:", row);
        });
    } catch (error) {
        console.error("Error al filtrar los datos:", error);
        // Mostrar un mensaje de error en la tabla
        const errorRow = document.createElement("tr");
        const errorCell = document.createElement("td");
        errorCell.textContent = "Error al cargar los datos.";
        errorCell.colSpan = 7;
        errorRow.appendChild(errorCell);
        tableBody.appendChild(errorRow);
    }
};

// Función para mostrar la sección seleccionada y ocultar las demás
function mostrarSeccion(id) {
    document.querySelectorAll("div").forEach(div => div.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

// Llamar a la función cuando se cambia la selección en el menú
document.getElementById("lineas-select").addEventListener("change", getFilteredData);
