function addTitle() {
    let title = document.getElementById('task-title').value;
    return title;
}

function addDescription() {
    let taskDescription = document.getElementById('task-description').value;
}

function addnewTask() {
    let taskFieldTodo = document.getElementById('task-field-todo');
    taskFieldTodo.innerHTML += addTitle();
    //window.location.href = 'board.html';
}