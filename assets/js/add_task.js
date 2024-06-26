let addTaskTitle = '';
let addTaskDescription = '';
let addTaskAssignedContacts = '';
let addTaskDueDate = '';
let addTaskPrio = '';
let addTaskCategory = '';
let addTaskSubtask = '';
let pressedButton = 0;
const base_URL = 'https://testing-ce5ae-default-rtdb.europe-west1.firebasedatabase.app/';

async function postData(path='tasks' ,data = {'title': addTaskTitle, 'description': addTaskDescription, 'contact': addTaskAssignedContacts, 'date': addTaskDueDate, 'prio': addTaskPrio, 'category': addTaskCategory, 'subtask': addTaskSubtask}) {
    try {
    let response = await fetch(base_URL + path + '.json',{
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
    addTaskTitle = title.value;
    title.value = '';
}

function addDescription() {
    let taskDescription = document.getElementById('task-description');
    addTaskDescription = taskDescription.value;
    taskDescription.value = '';
}

function assignedContact() {
    let assignedToContact = document.getElementById('assigned-to-contact'); 
    addTaskAssignedContacts = assignedToContact.value;
    assignedToContact.value = '';
}

function taskDueDate() {
    let dueDate = document.getElementById('task-due-date');
    let date = new Date(dueDate.value);
    let dateOption = {month: 'long' , day: 'numeric' , year: 'numeric'};
    let formattedDate = date.toLocaleDateString('en-US', dateOption);
    addTaskDueDate = formattedDate;
    dueDate.value = '';
}

function taskCategory() {
    let category = document.getElementById('select-task-category');
    addTaskCategory = category.value;
    category.value = '';
}

function taskSubtask() {
    let subtask = document.getElementById('task-subtask');
    addTaskSubtask = subtask.value;
    subtask.value = '';
}

function addnewTask() {
    addTitle();
    addDescription();
    assignedContact();
    taskDueDate();
    taskCategory();
    taskSubtask();
    postData(path='tasks' ,data = {'title': addTaskTitle, 'description': addTaskDescription, 'contact': addTaskAssignedContacts, 'date': addTaskDueDate, 'prio': addTaskPrio, 'category': addTaskCategory, 'subtask': addTaskSubtask});
    //window.location.href = 'board.html';
}

function checkIfFormFilled() {
    const form = document.getElementById('add-task-form');
    const requiredFields = form.querySelectorAll('[required]');
    let allFilled = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allFilled = false;
        }
    });
    if (allFilled) {
        addnewTask(); 
    } else {
        console.log('Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie absenden.');
    }

}
  
function setPrio(prio, number) {
    const priorities = ['urgent', 'medium', 'low'];
    const colors = ['orange', 'yellow', 'green'];  
    let pressedButton;

    // Setze die aktuelle Priorität und die Nummer des gedrückten Buttons
    addTaskPrio = prio;
    pressedButton = number;

    // Entferne die Klassen von allen Prio-Buttons
    priorities.forEach((priority, index) => {
        const prioElement = document.getElementById(`${priority}-prio`);
        const prioImgElement = document.getElementById(`${priority}-prio-img`);

        prioElement.classList.remove(`pressed-color-${colors[index]}`);
        prioImgElement.classList.remove('pressed-prio-img');
    });

  
    if (pressedButton > 0 && pressedButton <= priorities.length) {
        const currentPriority = priorities[pressedButton - 1];
        const currentColor = colors[pressedButton - 1];
        
        document.getElementById(`${currentPriority}-prio`).classList.add(`pressed-color-${currentColor}`);
        document.getElementById(`${currentPriority}-prio-img`).classList.add('pressed-prio-img');
    }
}


