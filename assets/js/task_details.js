let editPriority;
let assignedPersonsToUpdate = [];
let subtasksToUpdate = [];

function initTaskDetails() {
    setupListener();
    document.getElementById('update-date').valueAsDate = new Date();
}


/**
 * Displays 
 * @param {string} taskId - equivalent to the id of the task in firebase
 */
async function openTaskDetails(taskId) {
    await renderContactList();
    try {
        const assignedContacts = await renderTaskDetails(taskId);
        hideWindow('task-details-view', false);
        document.getElementById('task-card-wrapper').classList.toggle('dimm');
        document.getElementById('body').style = "overflow: hidden;"   
        document.getElementById('task-details-edit-btn').setAttribute('onclick', `openEditDialog('${taskId}')`);
        activateAssignedContacts(assignedContacts);
    } catch (error) {
        console.warn('This Task has been deleted by another user.');
        document.getElementById(`taskId${taskId}`).remove();
    }
}

/**
 * Start rendering process for Task details.
 * @param {string} taskId - string is containing the taskId that should become shown
 * @return {[]} - an Array with all assigned contacts of this task
 */
async function renderTaskDetails(taskId) {
    const data = await readData(`tasks/${taskId}`);
    return generateTaskDetailsHtml(taskId, data);
}

async function updateAssignedPersons(id) {
    const index = assignedPersonsToUpdate.indexOf(id);
    const assignedToEdit = document.getElementById('task-edit-view-assigned-persons');
    if (index === -1) {
        assignedPersonsToUpdate.push(id);
        assignedToEdit.insertAdjacentHTML('beforeend', await assignedPersonsEditHtml(id));
    } else {
        assignedPersonsToUpdate.splice(index, 1);
        document.getElementById(`edit_task_assigned-person-${id}`).remove();
    }
}

/**
 * Applys d-none to a specific DOM-Object
 * @param {*} id - the DOM-Object on which the d-none-toggle is applied to.
* @returns {HTMLElement|null} The DOM element with the specified ID, or null if no element with that ID exists.
 */
function toggleVisibility(id) {
    document.getElementById(id).classList.toggle('d-none');
    return document.getElementById(id);
}

async function openEditDialog(taskId) {
    toggleVisibility('task-edit-view'); 
    toggleVisibility('task-details-view');
}

/**
 * @param {string} id - set focus to an DOM-Content bases on the submited id
 */
function setFocus(id) {
    const inputField = document.getElementById(`${id}-add-subtask`);
    inputField.focus();
}

// Deletes the submitted taskId and closes task-detail-view
function deleteTask(taskId) {
    deleteData(`tasks/${taskId}`);
    toggleVisibility('task-details-view');
}