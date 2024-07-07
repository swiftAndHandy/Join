/**
 * placeholder
 */
function saveTaskUpdate() {
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
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
 * @param {string} id - used to complete the target-document-id
 */
function resetInputFields(id = 'edit') {
    hideWindow(`${id}-task-contact-list-btn`, false);
    hideWindow(`${id}-task-contact-list-input`);
    hideWindow(`${id}-task-contacts-list`);
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
 * @param {string} subtaskId - if of an list-item
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

    //needs to be adjusted for done: true
}