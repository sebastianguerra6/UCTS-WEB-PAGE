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
import { doc, updateDoc, getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

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
            const newValue = input.value.trim();

            if (newValue !== text) { // Verifica si el valor cambió
                try {
                    // Actualizar el documento en Firestore
                    await updateDocument(docId, fieldName, newValue);
                    console.log(`Campo actualizado en Firestore: ${fieldName} = ${newValue}`);
                } catch (error) {
                    console.error("Error al actualizar en Firestore:", error);
                    alert("Hubo un error al actualizar la base de datos.");
                    input.value = text; // Restaura el valor original en caso de error
                }
            }

            cell.textContent = newValue; // Actualiza la celda con el nuevo valor
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
    const collectionName = "key words";
    const selectedOption = document.getElementById("lineas-select").value; // Obtén el valor seleccionado
    const tableBody = document.querySelector("#data-table tbody");
    
    if (!selectedOption) {
        console.warn("Please select a Research Topic");
        return; // No continuar si no se ha seleccionado una opción
    }

    // Muestra la sección seleccionada en el menú
    mostrarSeccion("opcion1");

    console.log(`Filtrando documentos con "Line of research" igual a "${selectedOption}"`);

    try {
        // Limpia la tabla antes de insertar nuevos datos
        tableBody.innerHTML = "";

        // Crea la consulta con el filtro
        const q = query(
            collection(db, collectionName),
            where("Line of research", "==", selectedOption)
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
            const docId = doc.id; // Obtén el ID del documento

            // Crear una fila para cada documento
            const row = document.createElement("tr");

            // Crear celdas para cada columna
            row.appendChild(createCell(data["Line of research"], true, docId, "Line of research"));
            row.appendChild(createCell(data["Words"], true, docId, "Words"));
            


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

// Función para actualizar un campo en Firestore
async function updateDocument(docId, fieldName, newValue) {
    try {
        const docRef = doc(db, "key words", docId); // Cambia "key words" por tu colección
        await updateDoc(docRef, {
            [fieldName]: newValue, // Usa notación de corchetes para actualizar dinámicamente el campo
        });
        console.log(`Documento ${docId} actualizado: ${fieldName} = ${newValue}`);
    } catch (error) {
        console.error("Error al actualizar el documento:", error);
        throw error; // Lanza el error para manejarlo en el evento del input
    }
}
// Variable para almacenar la línea de investigación seleccionada
let selectedResearchLine = "";

// Función para abrir el formulario
function openAddWordForm() {
    // Obtén la línea de investigación seleccionada
    selectedResearchLine = document.getElementById("lineas-select").value;
    if (!selectedResearchLine) {
        alert("Por favor selecciona una línea de investigación primero.");
        return;
    }

    // Muestra el formulario
    document.getElementById("add-word-form").classList.remove("hidden");
}

// Función para cerrar el formulario
function closeAddWordForm() {
    document.getElementById("add-word-form").classList.add("hidden");
}

// Función para añadir una nueva palabra a Firestore
async function addNewWord() {
    const newWord = document.getElementById("new-word").value.trim();
    

    

    try {
        // Guarda la nueva palabra en Firestore
        await addDoc(collection(db, "key words"), {
            "Line of research": selectedResearchLine,
            "Words": newWord,
            
        });

        alert("Nueva palabra añadida exitosamente.");
        closeAddWordForm();

        // Recargar los datos para mostrar la nueva palabra
        getFilteredData();
    } catch (error) {
        console.error("Error al añadir la nueva palabra:", error);
        alert("Hubo un error al añadir la nueva palabra.");
    }
}
window.openAddWordForm = openAddWordForm;
window.closeAddWordForm = closeAddWordForm;
window.addNewWord = addNewWord;

// Llamar a la función cuando se cambia la selección en el menú
document.getElementById("lineas-select").addEventListener("change", getFilteredData);
