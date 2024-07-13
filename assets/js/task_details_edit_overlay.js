/**
 * saves the updated information of the current task in firebase and rerenders
 * 1. edit view
 * 2. the single card on board
 * 3. task details
 */
async function saveTaskUpdate(taskId) {
    const tag = document.getElementById('task-details-tag').textContent;
    const title = isNotEmpty('title');
    const description = isNotEmpty('description');
    let deadline = isNotEmpty('date');
    deadline = isNotInPast(deadline);
    const priority = getCurrentPriority();
    const subtasks = updateSubtasksArray();
    const data = createTaskObject(tag, title, description, deadline, priority, subtasks);
    renderEditView(data, taskId);
    rerenderTaskOnBoard(data, taskId);
    toggleVisibility('task-edit-view');
    toggleVisibility('task-details-view');
    await putData(data, `tasks/${taskId}`);
    await renderTaskDetails(taskId);
    document.getElementById('edit-subtask-item-wrapper').innerHTML = '';
}


/**
 * checks the value of an Element without leading and trailing spaces. 
 * If it's empty, return the old value, otherwise the new one. 
 * @param {string} target - part of the ElementID in "update-" and "task-details-"
 * @returns {string} - date in the format yyyy-mm-dd
 */
function isNotEmpty(target) { 
    if (document.getElementById(`update-${target}`).value.trim() != '') {
        return document.getElementById(`update-${target}`).value.trim()
    } else {
        let result = document.getElementById(`task-details-${target}`).innerText;
        return result.replaceAll('/', '-');
    }
}


/**
 * Used to create an object that will be posted to the server
 * @param {string} tag - tag of the task
 * @param {string} title - new title of the task
 * @param {string} description - new description of the task
 * @param {string} deadline -formated yyyy-mm-dd, new deadline of the task
 * @param {string} priority - empty or Low, Medium or Urgent
 * @param {Array} subtasks - contains every subtask with goal and an information about done or not
 * @returns {Object[]} - containing all updated data from above.
 */
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


/**
 * Renders the Edit-View of a Task by updating the save Button and set 
 * title, description, date, priority 
 * to the current tasks values.
 * @param {Object} task - Containes the information collection of the current task, fetched from firebase
 * @param {string} key - Contains the task ID.
 */
function renderEditView(task, key) {
    document.getElementById('save-task-update').setAttribute('onclick', `saveTaskUpdate('${key}')`)
    document.getElementById('update-title').value = task.title;
    document.getElementById('update-description').value = task.description;
    document.getElementById('update-date').value = task.date;
    try {
       const button = document.getElementById(`edit-priority-btn-${task.priority.toLowerCase()}`);
       !button.classList.contains('active') && document.getElementById(`edit-priority-btn-${task.priority.toLowerCase()}`).click();
    } catch (error) { console.warn('This Task has no priority.'); }
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
    const btns = ['low', 'medium', 'urgent']
    for (let i = 0; i < btns.length; i++) {
        const currentButton = document.getElementById(`edit-priority-btn-${btns[i]}`);
        if (currentButton) {
            i == level ? currentButton.classList.toggle('active') : currentButton.classList.remove('active');
        }
    }
}


/**
 * Selects the first (and only) Priority Button with .task-priority.active and 
 * strips the priority level out of the Buttons id. Since we save the Priority with an Uppercase first Letter,
 * the string is returned with a capitalized first letter.
 * @returns {string} - Returns the priority of the Actice Button as string.
 */
function getCurrentPriority() {
    try {
        let activeBtn = document.querySelector('.task-priority.active');
        activeBtn = activeBtn.id.split('edit-priority-btn-').join('');
        return capitaliseFirstLetters(activeBtn);
    } catch {
        return '';
    }
}


/**
 * Removes active class from every priority button to prevent that it is forced to add a priority when 
 * you edit a card without priority after opening another card, that has a priority.
 */
function resetPriorityButtons() {
    const btns = ['low', 'medium', 'urgent'];
    btns.forEach(id => {
        document.getElementById(`edit-priority-btn-${id}`).classList.remove('active');
    });
}


/**
 * Reset Input-Field for new Subtask, when discarded.
 */
function discardNewSubtask() {
    document.getElementById('edit-add-subtask').value = '';
    blurListener();
}


/**
 * Opens the Input Field for a subtask the user wants to edit.
 * @param {string} subtaskId -id of the subtask input that should become oppened
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
    const value = document.getElementById(`single-subtask-input-${subtaskId}`).value.trim()
    if (value) {
        target.innerText = value;
        document.getElementById(`edit-subtask-total-${subtaskId}`).classList.remove('d-none');
        document.getElementById(`single-subtask-input-wrapper-${subtaskId}`).classList.add('d-none');
    }
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
 * Deletes an Subtask-Item from Edit-View, not from Firebase!
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
    let query = document.querySelectorAll('.subtaskitem.false')
    let result = [];
    query.forEach((item) => result.push(
        { 'goal': item.innerText, 'done': false }
    ));

    query = document.querySelectorAll('.subtaskitem.true')
    query.forEach((item) => result.push(
        { 'goal': item.innerText, 'done': true }
    ));
    return result;
}


/**
 * Selects every checkbox+ label pair on Task-Details-View,
 * and a second selection of all checked checkbox-label-pairs.
 * Substracts every checked (done) subtask from pool, since they shouldn't become displayed in edit-view.
 * Iterates trough this filtered openSubtasks-Array and let do addNewSubtask() the magic ;-)
 */
function renderOpenSubtasks() {
    const allSubtasks = Array.from(document.querySelectorAll('input[type="checkbox"].subtask-checkbox + label'));
    const doneSubtasks = Array.from(document.querySelectorAll('input[type="checkbox"].subtask-checkbox:checked + label'));
    const openSubtasks = allSubtasks.filter(subtask => !doneSubtasks.includes(subtask));

    openSubtasks.forEach(item => {
        addNewSubtask(item.innerText, 'edit-subtask-item-wrapper', 'form', '', false);
    });

    doneSubtasks.forEach(item => {
        addNewSubtask(item.innerText, 'edit-subtask-item-wrapper', 'form', '', true);
    });
}


/**
 * add this, when a new subtask is submitted. This function must be called explicite.
 * param was added later make this function apple to be used from team-members.
 */
function scrollToLastSubtask(specialTarget = '') {
    document.getElementById(`edit-view-scrollbar${specialTarget}`).lastElementChild.scrollIntoView({behavior: 'smooth', block: 'end'});
}


/**
 * Generates HTML for assigned Persons in the task-edit-window.
 * @param {string} contactIds - the ID of a single contact, that avatar needs to be rendered
 * @returns {string} - contains the rendered HTML
 */
async function assignedPersonsEditHtml(contactIds) {
    const data = await readData(`${contactIds}`)
    const output = `
            <div id="edit_task_assigned-person-${contactIds}" class="details__inner">
                <div id="edit-task-avatar-${contactIds}" class="avatar at-drop-down" style="background-color: ${data.color};">${initials(data.name)}</div>
            </div>
            `
    return output;
}