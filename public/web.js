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
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";



// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para crear una celda de tabla
function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text || "Sin dato"; // Si no hay dato, poner "Sin dato"
    return cell;
}

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
