let addTaskTitle = [];
let addTaskDescription = [];
let addTaskAssignedContacts = [];
let addTaskDueDate = [];
let addTaskPrio = [];
let addTaskCategory = [];
let addTaskSubtask = [];
    
const base_URL = 'https://join-c0587-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(data={addTaskTitle, addTaskDescription, addTaskAssignedContacts, addTaskDueDate, addTaskPrio, addTaskCategory, addTaskSubtask}) {
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
    addTaskTitle.push(title.value);
    title.value = '';
}

function addDescription() {
    let taskDescription = document.getElementById('task-description');
    addTaskDescription.push(taskDescription.value);
    taskDescription.value = '';
}

function assignedContact() {
    let assignedToContact = document.getElementById('assigned-to-contact'); 
    addTaskAssignedContacts.push(assignedToContact.value);
    assignedToContact.value = '';
}

function taskDueDate() {
    let dueDate = document.getElementById('task-due-date');
    let date = new Date(dueDate.value);
    let dateOption = {month: 'long' , day: 'numeric' , year: 'numeric'};
    let formattedDate = date.toLocaleDateString('en-US', dateOption);
    addTaskDueDate.push(formattedDate);
    dueDate.value = '';
}

function taskCategory() {
    let category = document.getElementById('select-task-category');
    addTaskCategory.push(category.value);
    category.value = '';
}

function taskSubtask() {
    let subtask = document.getElementById('task-subtask');
    addTaskSubtask.push(subtask.value);
    subtask.value = '';
}

function addnewTask() {
    addTitle();
    addDescription();
    assignedContact();
    taskDueDate();
    taskCategory();
    taskSubtask();
    postData(data={addTaskTitle, addTaskDescription, addTaskAssignedContacts, addTaskDueDate, addTaskPrio, addTaskCategory, addTaskSubtask});
    //window.location.href = 'board.html';
}