let newTasks = [
    {   'addTaskTitle': [],
        'addTaskDescription' : [],
        'addTaskAssignedContacts' : [],
        'addTaskDueDate' : [],
        'addTaskPrio' : [],
        'addTaskCategory' : [],
        'addTaskSubtask' : []
    }
];

const base_URL = 'https://join-c0587-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(data={newTasks}) {
    try {
    let response = await fetch(base_URL + '.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
    } catch (error) { console.error('Error posting data:', error);
    return null;
    }
}

function addTitle() {
    let title = document.getElementById('task-title');
    newTasks[0]['addTaskTitle'].push(title.value);
    title.value = '';
}

function addDescription() {
    let taskDescription = document.getElementById('task-description');
    newTasks[0]['addTaskDescription'].push(taskDescription.value);
    taskDescription.value = '';
}

function assignedContact() {
    let assignedToContact = document.getElementById('assigned-to-contact'); 
    newTasks[0]['addTaskAssignedContacts'].push(assignedToContact.value);
    assignedToContact.value = '';
}

function taskDueDate() {
    let dueDate = document.getElementById('task-due-date');
    let date = new Date(dueDate.value);
    let dateOption = {month: 'long' , day: 'numeric' , year: 'numeric'};
    let formattedDate = date.toLocaleDateString('en-US', dateOption);
    newTasks[0]['addTaskDueDate'].push(formattedDate);
    dueDate.value = '';
}

function taskCategory() {
    let category = document.getElementById('select-task-category');
    newTasks[0]['addTaskCategory'].push(category.value);
    category.value = '';
}

function taskSubtask() {
    let subtask = document.getElementById('task-subtask');
    newTasks[0]['addTaskSubtask'].push(subtask.value);
    subtask.value = '';
}

function addnewTask() {
    addTitle();
    addDescription();
    assignedContact();
    taskDueDate();
    taskCategory();
    taskSubtask();
    postData(data={newTasks});
    //window.location.href = 'board.html';
}