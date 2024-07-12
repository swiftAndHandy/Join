let editPriority;
let assignedPersonsToUpdate = [];
let subtasksToUpdate = [];
let currentDetailLocation = null;

/**
 * Initialization of Task-Detail-View.
 */
function initTaskDetails() {
    setupListener();
}


/**
 * set up fetching task-information from server. updates currentDetailLocation, so that this information can be used later when task is saved.
 * activates assigned contacts in contact-list and renders the edit-view also.
 * @param {string} taskId - equivalent to the id of the task in firebase
 */
async function openTaskDetails(taskId) {
    await renderDetailsContactList();
    try {
        applyTaskStyles(taskId);
        const data = await renderTaskDetails(taskId);
        currentDetailLocation = data.status;
        activateAssignedContacts(data.assigned);
        renderEditView(data, taskId);
    } catch (error) {
        console.warn('This Task has been deleted by another user.');
        document.getElementById(`taskId${taskId}`).remove();
    }
}


/**
 * Reset everything at closing details, to prepare a new fresh detail-page.
 */
function closeDetails() {
    hideWindow('task-details-view');
    hideWindow('task-edit-view');
    currentDetailLocation = null;
    resetDetailCardHtml();
    resetPriorityButtons();
    resetAssignedPersons();
    returnToBoard();
}


/**
 * Called when a task is deleted or detail-view is closed to 
 * - reset Board-Styles 
 * - clear Subtasks and Contact-Lists
 */
function returnToBoard() {
    document.getElementById('task-card-wrapper').classList.remove('dimm');
    document.getElementById('body').style = "overflow: unset;"
    document.getElementById('edit-subtask-item-wrapper').innerHTML = '';
}


/**
 * Called when a task is deleted or detail-view is closed to 
 * - reset Board-Styles 
 * - clear Subtasks and Contact-Lists
 */
function resetAssignedPersons() {
    document.getElementById('edit-task-contacts-list').innerHTML = '';
    document.getElementById('edit-task-view-assigned-persons').innerHTML = '';
    assignedPersonsToUpdate = [];
}

/**
 * This function is called in openTaskDetails and sets the design
 * @param {string} taskId - the Task-Card that should be affected by this function
 */
function applyTaskStyles(taskId) {
    hideWindow('task-details-view', false);
    document.getElementById('task-card-wrapper').classList.add('dimm');
    document.getElementById('body').style = "overflow: hidden;"
    document.getElementById('task-details-edit-btn').setAttribute('onclick', `openEditDialog('${taskId}')`);
}


/**
 * Start rendering process for Task details.
 * @param {string} taskId - string is containing the taskId that should become shown
 * @return {[]} - an Array with all assigned contacts of this task
 */
async function renderTaskDetails(taskId) {
    const data = await readData(`tasks/${taskId}`);
    listAttachedSubtasks(data, taskId);
    return generateTaskDetailsHtml(taskId, data);
}


/**
 * Updates the global Array assignedPersonsToUpdate. If the id isn't in the Array
 * add the id to the Array. Also add the Icon with assignedPersonsEditHtml. 
 * Otherwise delete the Index that is used by the id and remove the Avatar-Icon.
 * @param {string} id - related to the assigned Contact
 */
async function updateAssignedPersons(id) {
    const index = assignedPersonsToUpdate.indexOf(id);
    const assignedToEdit = document.getElementById('edit-task-view-assigned-persons');
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


/**
 * Swaps the Visibility of Detail-View and Edit-View
 * Initiates renderOpenSubtasks to display an up-to-date-list
 */
async function openEditDialog() {
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
    renderOpenSubtasks();
}


/**
 * Used to set the focus to an specific subtask element.
 * @param {string} id - set focus to an DOM-Content bases on the submited id
 */
function setFocus(id) {
    const inputField = document.getElementById(`${id}-add-subtask`);
    inputField.focus();
}


/**
 * Deletes the submitted taskId and closes task-detail-view.
 * Resets the style changes that are applyed when opening a taskDetail-View
 * @param {string} taskId - ID of the task that will be deleted
 */
async function deleteTask(taskId) {
    await deleteData(`tasks/${taskId}`);
    toggleVisibility('task-details-view');
    document.getElementById(`taskId${taskId}`).remove();
    updateTaskFields(['todo', 'progress', 'feedback', 'done']);
    resetAssignedPersons();
    returnToBoard();
}


/**
 * posts true of false depending on checkbox.checked
 * @param {string} path complete path of the subtask-done-value
 * @param {string} target id of the specific checkbox
 * @param {string} taskId id of the main-task
 */
async function updateSingleSubtask(path, target, taskId) {
    value = document.getElementById(`${target}`).checked;
    await putData(value, path);
    getSubtaskProgress(await readData(`tasks/${taskId}/subtasks`), taskId);
}