// Sample data
const columns = [
    {
        id: 'ToDo',
        name: 'No iniciado',
        tasks: [
            { id: 1, title: 'Diseño de maquetas de interfaz de usuario', status: 'No iniciado', developer: 'Gianfranco', qa: '', productOwner: '', description: '', acceptanceCriteria: '', comments: [] },
            { id: 2, title: 'Crear API', status: 'No iniciado', developer: '', qa: '', productOwner: '', description: '', acceptanceCriteria: '', comments: [] },
        ]
    },
    {
        id: 'InProcess',
        name: 'En proceso',
        tasks: [
            { id: 3, title: 'Implementar la autenticación de usuarios', status: 'En proceso', developer: '', qa: '', productOwner: '', description: '', acceptanceCriteria: '', comments: [] },
        ]
    },
    {
        id: 'Done',
        name: 'Terminado',
        tasks: [
            { id: 4, title: 'Creación del proyecto base', status: 'Terminado', developer: '', qa: '', productOwner: '', description: '', acceptanceCriteria: '', comments: [] },
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
        updateTaskStatus(draggedTask.dataset.taskId, columnElement.querySelector('h2').textContent);
    }
}

/*function updateTaskStatus(taskId, newStatus) {
    debugger;
    let selectedTask;

    for (let i = 0; i < columns.length; i++) {
        debugger;
        const column = columns[i];
        const task = column.tasks.find(t => t.id == taskId);
        if (task) {
            selectedTask = task;
            task.status = newStatus;
            column.tasks = column.tasks.filter(t => t.id != taskId);
            break;
        }
    }

    const targetColumn = columns.find(column => column.id == newStatus);
    debugger;
    if (targetColumn && selectedTask) {
        targetColumn.tasks.push(selectedTask);
    }
}*/

function updateTaskStatus(taskId, newStatus) {
    let selectedTask;
    
    for (let i = 0; i < columns.length; i++) {
        const task = columns[i].tasks.find(t => t.id == taskId);

        if (task) {
            selectedTask = task;
            task.status = newStatus;
            columns[i].tasks = columns[i].tasks.filter(t => t.id != taskId);
            break;
        }
    }
    /*columns.forEach(column => {
        debugger;
        const task = column.tasks.find(t => t.id == taskId);
        selectedTask = task;

        if (task) {
            task.status = newStatus;
            column.tasks = column.tasks.filter(t => t.id != taskId);
        }
    });*/

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
        <label>Status:</label>
        <select id="taskStatus">
            <option value="ToDo" ${task.status === 'No iniciado' ? 'selected' : ''}>No iniciado</option>
            <option value="InProcess" ${task.status === 'En proceso' ? 'selected' : ''}>En proceso</option>
            <option value="Done" ${task.status === 'Terminado' ? 'selected' : ''}>Terminado</option>
        </select>
        <label>Developer:</label>
        <input type="text" id="taskDeveloper" value="${task.developer}">
        <label>QA:</label>
        <input type="text" id="taskQA" value="${task.qa}">
        <label>Product Owner:</label>
        <input type="text" id="taskPO" value="${task.productOwner}">
        <label>Description:</label>
        <textarea id="taskDescription" rows="4">${task.description}</textarea>
        <label>Acceptance Criteria:</label>
        <textarea id="taskCriteria" rows="4">${task.acceptanceCriteria}</textarea>
        <div class="comments">
            <h3>Comments</h3>
            <div id="commentList"></div>
            <div class="add-comment">
                <textarea id="newComment" placeholder="Add a comment..." rows="2"></textarea>
                <button onclick="addComment(${task.id})">Add Comment</button>
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
    renderBoard();
}

function renderComments(task) {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    task.comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `<strong>${comment.author}</strong>: ${comment.text}`;
        commentList.appendChild(commentElement);
    });
}

function addComment(taskId) {
    const newCommentText = document.getElementById('newComment').value.trim();
    if (newCommentText) {
        const task = columns.flatMap(col => col.tasks).find(t => t.id == taskId);
        if (task) {
            task.comments.push({ author: 'Current User', text: newCommentText });
            renderComments(task);
            document.getElementById('newComment').value = '';
        }
    }
}

//
renderBoard();