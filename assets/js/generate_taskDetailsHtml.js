/**
 * Generates the Task-Detail-View-HTML
 * @param {string} taskId - contains the current tasks ID
 * @param {object} taskDetails contains the current tasks details
 * @returns - an array, that contains all assigned contacts
 */
async function generateTaskDetailsHtml(taskId, taskDetails) {
    const tag = document.getElementById('task-details-tag');
    const assignedTo = taskDetails['assigned'];
    tag.innerHTML = taskDetails['tag'];
    taskDetails['tag'] === 'User Story' ? tag.setAttribute('class', 'tag user-story') : tag.setAttribute('class', 'tag technical-task');
    document.getElementById('task-details-title').innerHTML = taskDetails['title'];
    document.getElementById('task-details-description').innerHTML = taskDetails['description'];
    document.getElementById('task-details-date').innerHTML = taskDetails['date'].split('-').join('/');
    document.getElementById('details-priority-text').innerHTML = taskDetails['priority'];
    document.getElementById('details-priority-img').src = `../assets/img/icons/priority_${taskDetails['priority'].toLowerCase()}.svg`;
    document.getElementById('details-assigned-list').innerHTML = ''
    assignedPersonsDetailsHtml(assignedTo);
    document.getElementById('task-details-delete-btn').setAttribute('onclick', `deleteTask('${taskId}')`);
    return taskDetails;
}


/**
 * Resets Details of a Card. 
 * I used variables for better readablity, even if this results in more than 14 LOC.
 */
function resetDetailCardHtml() {
    const tag = document.getElementById('task-details-tag');
    tag.innerHTML = '';
    tag.setAttribute('class', '');
    document.getElementById('task-details-title').innerHTML = '';
    document.getElementById('task-details-description').value = '';
    document.getElementById('task-details-date').innerHTML = '';
    document.getElementById('details-priority-text').innerHTML = '';
    document.getElementById('details-priority-img').src = '';
    document.getElementById('details-assigned-list').innerHTML = '';
    document.getElementById('details-subtasks-list').innerHTML = '';
    document.getElementById('task-details-delete-btn').setAttribute('onclick', `deleteTask('')`);
}

/**
 * Generates HTML for persons that shown in the assigned list in Task-Details
 * @param {Array} contactIds an array, that contains all assigned contacts
 * @returns {string} - HTML Content that was rendered
 */
async function assignedPersonsDetailsHtml(contactIds) {
    let output = '';
    if (contactIds) {
        for (let item of contactIds) {
            try {
                const data = await readData(`${item}`)
                document.getElementById('details-assigned-list').insertAdjacentHTML('beforeend', `
                <div class="details__inner">
                <div id="task-details-avatar-${item}" class="avatar at-drop-down" style="background-color: ${data.color};">${initials(data.name)}</div>
                    <span id="edit-task-username-ID">${data.name}</span>
                </div>
                `);
            } catch (error) { }
        }
    }
    return output;
}


/**
 * Creates HTML for Creating new Subtasks. This is originaly written for task-details, but changed in 
 * a way you can select a individual target-location and reuse this code on other pages.
 * Applys a random ID to this item. Submits only, if value isn't empty after trim spaces from begin and end
 * @param {string} value 
 */
function addNewSubtask(value, target = 'edit-subtask-item-wrapper', form = 'form', specialTarget = '', done = false) {
    target = document.getElementById(`${target}`);
    const id = randomId() + done;
    value = value.trim();
    if (value) {
        target.insertAdjacentHTML('beforeend', `${subtaskHTML(value, form, done, id)}`);
        document.getElementById(`edit-add-subtask${specialTarget}`).value = '';
    }
}


/**
 * Generates HTML for Subtasks at Edit-View
 * @param {string} value - goal of the subtask
 * @param {string} form - could be form or div, it's used to prevent bugs that could be triggered by form-form
 * @param {boolean} done true if the subtask is finished, otherwise false
 * @param {string} id - a randomized id, that is related to this subtask
 * @returns {string} - rendered HTML-Code
 */
function subtaskHTML(value, form, done, id) {
    return `
    <div id="edit-subtask-total-${id}" class="li-wrapper ${done}" ondblclick="openSubtaskInput('${id}');stopPropagation(event);">
        <ul id="edit-subtasks-unsorted-${id}" class="edit-subtasks-list"">
            <li>
                <div class=" single-list-item">
                    <span id="subtaskspan-${id}" class="subtaskitem ${done}">${value}</span>
                    <div class="hover-overlay" onclick="stopPropagation(event)">
                        <img src="./assets/img/icons/edit.svg" alt="" onclick="openSubtaskInput('${id}')">
                        <div class="vertical-line"></div>
                        <img src="./assets/img/icons/delete.svg" alt="" onclick="deleteSubtask('${id}');">
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <${form} id="single-subtask-input-wrapper-${id}" class="single-subtask-input-box d-none" onsubmit="updateSubtaskInput('${id}');return false;">
        <input id="single-subtask-input-${id}" onkeydown="addEntertoSubTasks('${id}')" type="text">
        <img class="link-btn discard-btn" src="./assets/img/icons/discard.svg" alt="" onclick="discardSubtaskInput('${id}')">
        <div class="vertical-line"></div>
        <img class="link-btn accept-btn" src="./assets/img/icons/check_blue.svg" alt="" onclick="updateSubtaskInput('${id}')">
    </${form}}>
    `;
}


/**
 * Creates HTML for every subtask Element thats given to a task and iterates trough data.subtasks.length to ensure
 * a unique ID for every checkbox/label-pair.
 * @param {Object} data - contains all information related to taskId
 * @param {string} taskId - the Key of the current read Task
 */
async function listAttachedSubtasks(data, taskId) {
    const targetLocation = document.getElementById('details-subtasks-list');

    if (Array.isArray(data.subtasks)) {
        targetLocation.innerHTML = '';
        for (let i = 0; i < data.subtasks.length; i++) {
            targetLocation.insertAdjacentHTML('beforeend', `${attachedSubtasksHTML(taskId, i, data)}`);
        }
    } else {
        noSubtasksAttached();
        data.subtasks && console.warn('Firebase issue. Pls ensure to save JSON-Arrays or nothing in subtasks. Strings will not be displayed!');
    }
}


/**
 * generates HTML for every subtask in detail-view to allow check/uncheck done state
 * @param {string} taskId id of the currently task
 * @param {number} i - index of the current subtask
 * @param {*} data - all information that is related to the task
 * @returns {string} - rendered HTML-Code
 */
function attachedSubtasksHTML(taskId, i, data) {
    return `<div class="details__subtask">
        <input type="checkbox" 
        onchange="updateSingleSubtask(
            'tasks/${taskId}/subtasks/${i}/done', 
            'details-task${taskId}-subtask-${i}', 
            '${taskId}'
        )"
        class="edit checkbox subtask-checkbox" 
        id="details-task${taskId}-subtask-${i}" 
        name="details-task${taskId}-subtask-${i}" 
        ${data.subtasks[i].done ? 'checked' : ''}>
        <label id="label-for-details-task${taskId}-subtask-${i}" for="details-task${taskId}-subtask-${i}">${data.subtasks[i].goal}</label>
    </div>`;
}

/**
 * When no Subtask is attached, add this msg to subtask-list.
 */
function noSubtasksAttached() {
    document.getElementById('details-subtasks-list').innerHTML = "This Task has no Subtasks.";
}