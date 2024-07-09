/**
 * placeholder
 */
async function saveTaskUpdate(taskId) {
    const tag = document.getElementById('task-details-tag').textContent;
    const title = document.getElementById('update-title').value
    const description = document.getElementById('update-description').value;
    const deadline = document.getElementById('update-date').value;
    const priority = getCurrentPriority();
    const subtasks = updateSubtasksArray();
    const data = createTaskObject(tag, title, description, deadline, priority, subtasks);
    renderEditView(data, taskId);
    rerenderTaskOnBoard(data, taskId);
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
    await putData(data, `tasks/${taskId}`);
    await renderTaskDetails(taskId);

}

function createTaskObject(tag, title, description, deadline, priority, subtasks) {
    return {
        'tag': tag,
        'title': title,
        'description': description,
        'date': deadline,
        'priority': priority,
        'assigned': assignedPersonsToUpdate, 
        'subtasks': subtasks,
        'status': currentDetailLocation
    }
}

function renderEditView(task, key) {
    document.getElementById('save-task-update').setAttribute('onclick', `saveTaskUpdate('${key}')`)
    document.getElementById('update-title').value = task.title;
    document.getElementById('update-description').innerText = task.description;
    document.getElementById('update-date').value = task.date;
    document.getElementById(`edit-priority-btn-${task.priority.toLowerCase()}`).click();
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

function getCurrentPriority() {
    let activeBtn = document.querySelector('.task-priority.active');
    activeBtn = activeBtn.id.split('edit-priority-btn-').join('');
    return capitaliseFirstLetters(activeBtn);
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
 * @returns {Object[]} return of an JSON-Array with this information:
 * @returns {string} return[].goal - Archived when this goal is reached
 * @returns {boolean} return[].done Tracks when it is archived
 * 
 * How to use this: 
 * For new Tasks: add .subtaskitem to every task-item you want to create. 
 * For existing and finished tasks: add .subtask-checkbox to every checkbox and add a label, that contains the task-text
 */
function updateSubtasksArray() {
    let query = document.querySelectorAll('.subtaskitem')
    let result = [];
    query.forEach((item) => result.push(
        { 'goal': item.innerText, 'done': false }
    ));

    query = document.querySelectorAll('input[type="checkbox"].subtask-checkbox:checked + label');
    query.forEach((item) => result.push(
        { 'goal': item.innerText, 'done': true }
    ));
    return result;
}
