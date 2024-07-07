let editPriority;
let assignedPersonsToUpdate = [];
let subtasksToUpdate = [];

function initTaskDetails() {
    setupListener();
    document.getElementById('update-date').valueAsDate = new Date();
}

async function openTaskDetails(taskId) {
    await renderContactList();
    const assignedContacts = await renderTaskDetails(taskId);
    hideWindow('task-details-view', false);
    document.getElementById('task-card-wrapper').classList.toggle('dimm');
    document.getElementById('body').style = "overflow: hidden;"
    activateAssignedContacts(assignedContacts);
    document.getElementById('task-details-edit-btn').setAttribute('onclick', `openEditDialog('${taskId}')`);

}

/**
 * Rendering Contact-List in Edit-Details. 
 * Needs further improvement (include accounts, not only contacts for example)
 * Maybe a resort to keep the order of alphabet is required in this case
 */
async function renderContactList(assignedContacts) {
    const data = await readData('contacts');
    let entries = sortByAlphabet(data, 'contacts');
    for (let i = 0; i < entries.length; i++) {
        generateContactsHtml(entries[i]);
    }
}

/**
 * Simulates an click on every assigned contact to activate it for contact list and submit array (assignedPersonsToUpdate)
 */
async function activateAssignedContacts(assignedContacts) {
    for (let item of assignedContacts) {
        try {
            document.getElementById(`assign-contact-contacts/${item}`).click();
            console.log(`${item} is toggled`);
        } catch(error) {
            console.warn(`The contact with the ID ${item} has been deleted and won't be displayed.`);
        }
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

/**
 * Controls the design of checkboxes on the assigned-contacts-list
 * CAVE: id contains contacts/ (or theoretically accounts/). 
 * This is the optimum, so we can stop use pathes at readData and allow to assign users
 * For the moment, since it's not used trough the whole project, i'll filter and remove it.
 * @param {string} id 
 */
async function toggleThisContact(id) {
    const contactId = document.getElementById(`assign-contact-${id}`);
    const checkboxId = document.getElementById(`assign-contact-checkbox-${id}`);
    const pseudoCheckboxId = document.getElementById(`assign-contact-pseudo-checkbox-${id}`);
    id = id.replace('contacts/', '');
    await updateAssignedPersons(id);
    contactId.classList.toggle('list-selected');
    pseudoCheckboxId.classList.toggle('list-selected');
    checkboxId.checked = !checkboxId.checked;
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
 * Reset everything on closeDetails, to prepare a new fresh detail-page
 */
function closeDetails() {
    toggleVisibility('task-details-view');
    document.getElementById('task-card-wrapper').classList.toggle('dimm');
    document.getElementById('body').style = "overflow: unset;"
    document.getElementById('task-edit-view-assigned-persons').innerHTML = '';
    assignedPersonsToUpdate = [];
    document.getElementById('edit-task-contacts-list').innerHTML = '';
}

/**
 * Unfinished. 
 * Setup some Event-Listeners for focus-design on edit-task-details input-fields (contact-search and add-new-subtask)
 */
function setupListener() {
    let listener = document.getElementById('edit-add-subtask');
    listener.addEventListener('focus', focusListener);
    listener.addEventListener('blur', blurListener);

    listener = document.getElementById('edit-task-list-input-field');
    const target = 'edit-task-contact-list-input';
    listener.addEventListener('focus', () => document.getElementById(target).classList.add('focus'));
    listener.addEventListener('blur', () => document.getElementById(target).classList.remove('focus'));
}

/**
 * Change Button-Design based on focus of input-field. 
 * Show discard and save-button, when input for new subtask is active
 */
function focusListener() {
    document.getElementById('edit-subtask-box').classList.add('focus');
    hideWindow('edit-view-subtask-navigation', false);
    hideWindow('edit-view-subtask-add');
}


/**
 * Change Button-Design based on focus of input-field. 
 * Hide discard and save-button, when input for new subtask is active
 * Show add button instead.
 */
function blurListener() {
    let listener = document.getElementById('edit-add-subtask')
    document.getElementById('edit-subtask-box').classList.remove('focus');
    if (!listener.value) {
        hideWindow('edit-view-subtask-navigation');
        hideWindow('edit-view-subtask-add', false);
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
    toggleVisibility('task-edit-view'); toggleVisibility('task-details-view');
}

/**
 * Sets the priority level by updating the `editPriority` variable and toggling the 'active' class on priority buttons.
 * @param {number} level - The priority level to set. Expected values are 0 for 'low', 1 for 'medium', and 2 for 'urgent'.
 */
function setPriorityTo(level) {
    editPriority = level;
    const btns = ['low', 'medium', 'urgent']
    for (let i = 0; i < btns.length; i++) {
        const currentButton = document.getElementById(`edit-priority-btn-${btns[i]}`);
        if (currentButton) {
            i == editPriority ? currentButton.classList.add('active') : currentButton.classList.remove('active');
        }
    }
}

/**
 * toggles the visibility of contact-list and contact-list input to show/hide the DOM-Content.
 * @param {string} id - used to get the correct id for design changes
 */
function openListSearch(id) {
    const btn = toggleVisibility(`${id}-task-contact-list-btn`);
    toggleVisibility(`${id}-task-contact-list-input`);
    toggleVisibility(`${id}-task-contacts-list`)
    const inputField = document.getElementById(`${id}-task-list-input-field`);
    const inputBox = inputField.parentElement.classList.add('focus');
    inputField.focus();
}

/**
 * @param {string} id - set focus to an DOM-Content bases on the submited id
 */
function setFocus(id) {
    const inputField = document.getElementById(`${id}-add-subtask`);
    inputField.focus();
}


/**
 * @param {string} id - used to complete the target-document-id
 */
function resetInputFields(id = 'edit') {
    hideWindow(`${id}-task-contact-list-btn`, false);
    hideWindow(`${id}-task-contact-list-input`);
    hideWindow(`${id}-task-contacts-list`);
}

/**
 * Searchs for a contact based on a input.value and displays only contacts, who does match the search. 
 * @param {string} search - value of a text-input
 * example: <input type="text" oninput="searchContact(this.value)">;
 */
function searchContact(search) {
    const contactNames = Array.from(document.querySelectorAll('div.user-box span'));
    for (let item in contactNames) {
        hideWindow(contactNames[item].parentElement.parentElement.id,
            !contactNames[item].innerHTML.toLowerCase().includes(search.toLowerCase())
        );
    }
}

/**
 * Reset Input-Field for new Subtask
 */
function discardNewSubtask() {
    document.getElementById('edit-add-subtask').value = '';
    blurListener();
}

/**
 * @param {string} subtaskId - build an elementId related to subtask-id and change the input-style
 */
function openSubtaskInput(subtaskId) {
    const input = document.getElementById(`single-subtask-input-${subtaskId}`);
    document.getElementById(`edit-subtask-total-${subtaskId}`).classList.add('d-none');
    document.getElementById(`single-subtask-input-wrapper-${subtaskId}`).classList.remove('d-none');
    input.value = document.getElementById(`subtaskspan-${subtaskId}`).innerText;
    input.focus();
}

/**
 * Save the input the user made on text and set target.innerText to this input.
 * Hide the Input(Wrapper) and show List-Item instead.
 * @param {string} subtaskId 
 */
function updateSubtaskInput(subtaskId) {
    const target = document.getElementById(`subtaskspan-${subtaskId}`)
    const value = document.getElementById(`single-subtask-input-${subtaskId}`).value
    target.innerText = value;
    document.getElementById(`edit-subtask-total-${subtaskId}`).classList.remove('d-none');
    document.getElementById(`single-subtask-input-wrapper-${subtaskId}`).classList.add('d-none');
}

/**
 * Resetss the desgin of the Input/Span related to subtaskId
 * @param {strink} subtaskId - if of an list-item
 */
function discardSubtaskInput(subtaskId) {
    document.getElementById(`edit-subtask-total-${subtaskId}`).classList.remove('d-none');
    document.getElementById(`single-subtask-input-wrapper-${subtaskId}`).classList.add('d-none');
}

/**
 * @param {string} subtaskId - id of the item that should be deleted
 */
function deleteSubtask(subtaskId) {
    document.getElementById(`edit-subtask-total-${subtaskId}`).remove();
}

// Deletes the submitted taskId and closes task-detail-view
function deleteTask(taskId) {
    deleteData(`tasks/${taskId}`);
    toggleVisibility('task-details-view');
}

/**
 * placeholder
 */
function saveTaskUpdate() {
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
}

/**
 * updates an global array, based on a querySelector, that will be pushed to firebase
 * @param {string} relatedToTaskId - refers to a Task-ID and is used in path-param for putData
 */
async function updateSubtasksArray() {
    let query = document.querySelectorAll('.subtaskitem')
    let result = [];
    query.forEach((item) => result.push(
        {
            'name': item.innerText,
            'done': false
        }
    ));
}