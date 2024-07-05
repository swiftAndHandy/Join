let editPriority;
let assignedPersons = null;

function initTaskDetails() {
    setupListener();
    renderTaskDetails();
    renderContactList();
}


/**
 * Rendering Contact-List in Edit-Details. 
 * Needs further improvement (include accounts, not only contacts for example)
 * Maybe a resort to keep the order of alphabet is required in this case
 */
async function renderContactList() {
    const data = await readData('contacts');
    let entries = sortByAlphabet(data, 'contacts');
    for (let i = 0; i < entries.length; i++) {
        generateContactsHtml(entries[i]);
    }
}

// CAVE: Rendering every task. Need to adjust this later on and give a specific task to render
async function renderTaskDetails() {
    const data = await readData('tasks');
    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
        generateTaskDetailsHtml(keys[i], data[keys[i]]);
    }
}

/**
 * Controls the design of checkboxes on the assigned-contacts-list
 * @param {string} id 
 */
function toggleThis(id) {
    const contactId = document.getElementById(`assign-contact-${id}`);
    const checkboxId = document.getElementById(`assign-contact-checkbox-${id}`);
    const pseudoCheckboxId = document.getElementById(`assign-contact-pseudo-checkbox-${id}`);
    contactId.classList.toggle('list-selected');
    pseudoCheckboxId.classList.toggle('list-selected');
    checkboxId.checked = !checkboxId.checked;
}

/**
 * Unfinished. 
 * Setup some Event-Listeners for focus-design on edit-task-details input-fields (contact-search and add-new-subtask)
 */
function setupListener() {
    let listener = document.getElementById('edit-add-subtask')
    listener.addEventListener('focus', focusListener);
    listener.addEventListener('blur', blurListener);

    listener = document.getElementById('edit-task-list-input-field')
    listener.addEventListener('focus', () => document.getElementById('edit-task-contact-list-input').classList.add('focus'));
    listener.addEventListener('blur', () => document.getElementById('edit-task-contact-list-input').classList.remove('focus'));
}

/**
 * Change Button-Design based on focus of input-field. 
 * Show discard and save-button, when input for new subtask is active
 */
function focusListener() {
    document.getElementById('edit-subtask-box').classList.add('focus');
    document.getElementById('edit-view-subtask-navigation').classList.remove('d-none');
    document.getElementById('edit-view-subtask-add').classList.add('d-none');
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
        document.getElementById('edit-view-subtask-navigation').classList.add('d-none');
        document.getElementById('edit-view-subtask-add').classList.remove('d-none');
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

// placeholder
function deleteTask(taskId) {
    console.warn('Diese Task würde nun gelöscht. Geht aber noch nicht. Glückwunsch.')
}

/**
 * placeholder
 */
function saveTaskUpdate() {
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
}

/**
 * puts an array based on a querySelector with every subtaskitem to firebase
 * @param {string} relatedToTaskId - refers to a Task-ID and is used in path-param for putData
 */
async function updateSubtasks(relatedToTaskId) {
    let query = document.querySelectorAll('.subtaskitem')
    let result = [];
    query.forEach((item) => result.push(item.innerText));

    console.log(result);
    // await putDataset({ post }, `tasks/${relatedToTaskId}/subtasks`);
    // await putDataset({result : false}, `tasks/${relatedToTaskId}/subtasks`);
    // await putDataset({'name': 'horst'}, 'playground')
}