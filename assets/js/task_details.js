let editPriority;


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
function focusListener() {
    let listener = document.getElementById('edit-add-subtask')
    listener.addEventListener('focus', () => {
        document.getElementById('edit-subtask-box').classList.add('focus');
        document.getElementById('edit-view-subtask-navigation').classList.remove('d-none');
        document.getElementById('edit-view-subtask-add').classList.add('d-none');
    });

    listener.addEventListener('blur', () => {
        document.getElementById('edit-subtask-box').classList.remove('focus');
        document.getElementById('edit-view-subtask-navigation').classList.add('d-none');
        document.getElementById('edit-view-subtask-add').classList.remove('d-none');
    });

    listener = document.getElementById('edit-task-list-input-field')
    listener.addEventListener('focus', () => document.getElementById('edit-task-list-input').classList.add('focus'));
    listener.addEventListener('blur', () => document.getElementById('edit-task-list-input').classList.remove('focus'));
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
 *
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

function openListSearch(id) {
    const btn = toggleVisibility(`${id}-task-list-btn`);
    toggleVisibility(`${id}-task-list-input`);
    toggleVisibility(`${id}-task-contacts-list`)
    const inputField = document.getElementById(`${id}-task-list-input-field`);
    const inputBox = inputField.parentElement.classList.add('focus');
    inputField.focus();
}

function setFocus(id) {
    const inputField = document.getElementById(`${id}-add-subtask`);
    inputField.focus();
}


function resetInputFields(id = 'edit') {
    hideWindow(`${id}-task-list-btn`, false);
    hideWindow(`${id}-task-list-input`);
    hideWindow(`${id}-task-contacts-list`);
}

function searchForContactDemo() {
    // Alle span-Elemente auswählen
    const spans = document.querySelectorAll('span');

    // Das span-Element mit dem gewünschten Textinhalt finden
    const targetSpan = Array.from(spans).find(span => span.textContent.trim() === 'This is a test-task');

    if (targetSpan) {
        console.log('Element gefunden:', targetSpan);
    } else {
        console.log('Element nicht gefunden');
    }
}

function openSubtaskInput(subtaskId) {
    document.getElementById('edit-subtask-total-subtaskId').classList.add('d-none');
    document.getElementById('single-subtask-input-wrapper-subtaskId').classList.remove('d-none');
    document.getElementById('single-subtask-input-subtaskId').focus();
}

function updateSubtaskInput(subtaskId){
    document.getElementById('edit-subtask-total-subtaskId').classList.remove('d-none');
    document.getElementById('single-subtask-input-wrapper-subtaskId').classList.add('d-none');
}

function discardSubtaskInput(subtaskId){
    document.getElementById('edit-subtask-total-subtaskId').classList.remove('d-none');
    document.getElementById('single-subtask-input-wrapper-subtaskId').classList.add('d-none');
}

function deleteSubtask(subtaskId) {
    console.warn('Dieser Subtask würde nun gelöscht. Geht aber noch nicht. Glückwunsch.')
}

function deleteTask(taskId) {
    console.warn('Diese Task würde nun gelöscht. Geht aber noch nicht. Glückwunsch.')
}