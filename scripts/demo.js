// Sample data
let columns = [
    {
        id: 'ToDo',
        name: 'No iniciado',
        tasks: [
            { id: 1, title: 'Diseño de maquetas de interfaz de usuario', status: 'ToDo', developer: 'Pablo', qa: 'Melissa', productOwner: 'Gianfranco', description: 'Crear maquetas de interfaz de usuario para las nuevas funcionalidades de la aplicación, asegurando que sean intuitivas y visualmente atractivas.', acceptanceCriteria: 'Las maquetas deben seguir la guía de estilo de la empresa.\nCada sección de la interfaz debe estar representada en la maqueta.\nLas maquetas deben ser aprobadas por el equipo de diseño y el Product Owner.\nLa navegación entre diferentes secciones debe ser clara y coherente.', comments: [{ author: 'Pablo', text: '@Gianfranco ¿Puedo considerar estilos similares a los de esta página? https://frontendmasters.com/'}, { author: 'Gianfranco', text: '@Pablo Adelante.'}] },
            { id: 2, title: 'Crear API', status: 'ToDo', developer: 'Job', qa: 'Melissa', productOwner: 'Gianfranco', description: 'Desarrollar una API que permita la interacción entre el front-end y el back-end de la aplicación, asegurando que sea segura y escalable.', acceptanceCriteria: 'La API debe seguir los principios RESTful.\nDebe incluir documentación clara para todos los endpoints.\nDebe manejar la autenticación y autorización de usuarios.\nLos endpoints deben ser probados exhaustivamente con tests automatizados.\nLa API debe manejar errores de manera eficiente y proporcionar respuestas adecuadas.', comments: [{ author: 'Melissa', text: 'Realizaré mis pruebas con la ayuda de Postman'}] },
        ]
    },
    {
        id: 'InProcess',
        name: 'En proceso',
        tasks: [
            { id: 3, title: 'Implementar la autenticación de usuarios', status: 'InProcess', developer: 'Pablo', qa: 'Melissa', productOwner: 'Gianfranco', description: 'Desarrollar un sistema de autenticación que permita a los usuarios registrarse, iniciar sesión y gestionar sus perfiles de manera segura.', acceptanceCriteria: 'El sistema de autenticación debe permitir el registro de nuevos usuarios con validación de correo electrónico.\nLos usuarios deben poder iniciar sesión con su nombre de usuario/correo electrónico y contraseña.\nDebe implementarse el cifrado de contraseñas para almacenarlas de forma segura.\nEl sistema debe incluir opciones para la recuperación de contraseñas olvidadas.\nDeben realizarse pruebas de seguridad para asegurar la protección contra ataques de fuerza bruta y otros tipos de vulnerabilidades.', comments: [{ author: 'Job', text: 'Inicialmente yo tomaría esta tarea, pero @Pablo la realizará tras incorporarse al equipo.'}] },
        ]
    },
    {
        id: 'Done',
        name: 'Terminado',
        tasks: [
            { id: 4, title: 'Creación del proyecto base', status: 'Done', developer: 'Job', qa: '', productOwner: 'Gianfranco', description: 'Configurar la estructura inicial del proyecto, incluyendo la configuración de herramientas de desarrollo, estructura de carpetas y archivos, y la integración de sistemas de control de versiones.', acceptanceCriteria: 'La estructura del proyecto debe seguir las mejores prácticas de la industria y la guía de estilos del equipo.\nDebe configurarse un sistema de control de versiones (por ejemplo, Git) y el repositorio inicial debe estar creado.\nIncluir archivos de configuración esenciales como .gitignore, README.md, y cualquier archivo de configuración para herramientas de desarrollo necesarias.\nDeben estar creadas las carpetas y archivos base para el proyecto, como src/, tests/, docs/, etc.\nTodos los miembros del equipo deben poder clonar el repositorio y ejecutar una configuración básica para comenzar a trabajar.', comments: [{ author: 'Job', text: 'Tarea culminada.'}] },
        ]
    }
];

// Render board
function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    columns.forEach((column, columnIndex) => {
        const columnElement = document.createElement('div');
        columnElement.id = column.id;
        columnElement.className = 'column';
        columnElement.innerHTML = `<h2>${column.name}</h2>`;

        column.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.draggable = true;
            taskElement.textContent = task.title;
            taskElement.dataset.taskId = task.id;

            taskElement.addEventListener('dragstart', dragStart);
            taskElement.addEventListener('dragend', dragEnd);
            taskElement.addEventListener('click', () => openTaskDetails(task));

            columnElement.appendChild(taskElement);
        });

        columnElement.addEventListener('dragover', dragOver);
        columnElement.addEventListener('drop', drop);

        board.appendChild(columnElement);
    });
}

// Drag and drop functionality
let draggedTask = null;

function dragStart(e) {
    draggedTask = e.target;
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const columnElement = e.target.closest('.column');
    if (columnElement && draggedTask) {
        columnElement.appendChild(draggedTask);
        updateTaskStatus(draggedTask.dataset.taskId, columnElement.id);
    }
}

function updateTaskStatus(taskId, newStatus) {
    let selectedTask;

    for (let i = 0; i < columns.length; i++) {
        let task = columns[i].tasks.find(t => t.id == taskId);

        if (task) {            
            task.status = newStatus;
            selectedTask = task;
            columns[i].tasks = columns[i].tasks.filter(t => t.id != taskId);
            break;
        }
    }
    
    const targetColumn = columns.find(column => column.id == newStatus);
    if (targetColumn) {
        if (selectedTask) {
            targetColumn.tasks.push(selectedTask);
        }
    }
}

const modal = document.getElementById('taskModal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = closeTaskDetails;

window.onclick = (event) => {
    if (event.target == modal) {
        closeTaskDetails();
    }
};

function openTaskDetails(task) {
    const taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML = `
        <h2>${task.title}</h2>
        <label>Estado:</label>
        <select id="taskStatus">
            <option value="ToDo" ${task.status === 'ToDo' ? 'selected' : ''}>No iniciado</option>
            <option value="InProcess" ${task.status === 'InProcess' ? 'selected' : ''}>En proceso</option>
            <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Terminado</option>
        </select>
        <label>Dev:</label>
        <input type="text" id="taskDeveloper" value="${task.developer}">
        <label>QA:</label>
        <input type="text" id="taskQA" value="${task.qa}">
        <label>PO:</label>
        <input type="text" id="taskPO" value="${task.productOwner}">
        <label>Descripción:</label>
        <textarea id="taskDescription" rows="4">${task.description}</textarea>
        <label>Criterios de aceptación:</label>
        <textarea id="taskCriteria" rows="4">${task.acceptanceCriteria}</textarea>
        <div class="comments">
            <h3>Comments</h3>
            <div id="commentList"></div>
            <div class="add-comment">
                <textarea id="newComment" placeholder="Comenta aquí..." rows="2"></textarea>
                <button onclick="addComment(${task.id})">Agregar</button>
            </div>
        </div>
    `;

    renderComments(task);

    document.getElementById('taskStatus').addEventListener('change', (e) => {
        console.log(e.target.value)
        updateTaskStatus(task.id, e.target.value);
        renderBoard();
    });

    modal.style.display = 'block';
}

function closeTaskDetails() {
    modal.style.display = 'none';
}

function renderComments(task) {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    task.comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `<strong>${comment.author}</strong>: ${convertText(comment.text)}`;
        commentList.appendChild(commentElement);
    });
}

function addComment(taskId) {
    const newCommentText = document.getElementById('newComment').value.trim();
    if (newCommentText) {
        const task = columns.flatMap(col => col.tasks).find(t => t.id == taskId);
        if (task) {
            task.comments.push({ author: 'Visitante', text: newCommentText });
            renderComments(task);
            document.getElementById('newComment').value = '';
        }
    }
}

function convertText(inputString) {
    let result = inputString.replace(/(@\w+)/g, '<span style="color: blue; text-decoration: underline; font-weight: bold; cursor: pointer;">$1</span>');
    
    result = result.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    return result;
}

renderBoard();