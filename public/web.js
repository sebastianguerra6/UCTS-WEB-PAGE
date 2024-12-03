
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

// Función para obtener datos de Firestore
window.getFilteredData = async function getFilteredData() {
    const collectionName = "palabras-claves";
    const filterValue = "Cadena de suministro de alimentos, logística y distribución"; // Línea de investigación que deseas filtrar
    const tableBody = document.querySelector("#data-table tbody");

    console.log(`Filtrando documentos con "Líneas de investigación" igual a "${filterValue}"`);

    try {
        // Limpia la tabla antes de insertar nuevos datos
        tableBody.innerHTML = "";

        // Crea la consulta con el filtro
        const q = query(
            collection(db, collectionName),
            where("Líneas de investigación", "==", filterValue)
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
            console.log("Documento:", data); // Aquí se imprime el id y los datos del documento


            // Crear una fila para cada documento
            const row = document.createElement("tr");

            // Crear celdas para cada columna
            const grupoCell = document.createElement("td");
            grupoCell.textContent = data["Grupo"] || "Sin dato";

            const lineasInvestigacionCell = document.createElement("td");
            lineasInvestigacionCell.textContent = data["Líneas de investigación"] || "Sin dato";

            const wordsCell = document.createElement("td");
            wordsCell.textContent = data["Words"] || "Sin dato";

            const resultadoCell = document.createElement("td");
            resultadoCell.textContent = data["Resultado"] || "Sin dato";

            const filtroFechaCell = document.createElement("td");
            filtroFechaCell.textContent = data["Con Filtro de Fecha"] || "Sin dato";

            const conResultadoCell = document.createElement("td");
            conResultadoCell.textContent = data["Con Resultado"] || "No";

            const conResultadoFechaCell = document.createElement("td");
            conResultadoFechaCell.textContent = data["Con Resultado Fecha"] || "No";

            // Añadir las celdas a la fila
            row.appendChild(grupoCell);
            row.appendChild(lineasInvestigacionCell);
            row.appendChild(wordsCell);
            row.appendChild(resultadoCell);
            row.appendChild(filtroFechaCell);
            row.appendChild(conResultadoCell);
            row.appendChild(conResultadoFechaCell);

            // Añadir la fila al cuerpo de la tabla
            tableBody.appendChild(row);
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
}

// Llama a la función
getFilteredData();