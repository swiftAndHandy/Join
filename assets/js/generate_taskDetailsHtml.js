/**
 * Generates the Task-Detail-View-HTML
 * @param {string} taskId - contains the current tasks ID
 * @param {object} taskDetails contains the current tasks details
 * @returns - an array, that contains all assigned contacts
 */
async function generateTaskDetailsHtml(taskId, taskDetails) {
    const tag = document.getElementById('task-details-tag');
    tag.innerHTML = taskDetails['tag'];
    taskDetails['tag'] === 'User Story' ? tag.setAttribute('class', 'tag user-story') : tag.setAttribute('class', 'tag technical-task');

    const title = document.getElementById('task-details-title');
    title.innerHTML = taskDetails['title'];

    const description = document.getElementById('task-details-description');
    description.innerHTML = taskDetails['description'];

    const deadline = document.getElementById('task-details-date');
    deadline.innerHTML = taskDetails['date'].split('-').join('/');

    const priority = document.getElementById('details-priority-text');
    const priorityImg = document.getElementById('details-priority-img');
    priority.innerHTML = taskDetails['priority'];
    priorityImg.src = `../assets/img/icons/priority_${taskDetails['priority'].toLowerCase()}.svg`;

    const assignedTo = taskDetails['assigned'];
    document.getElementById('details-assigned-list').innerHTML = ''
    assignedPersonsDetailsHtml(assignedTo);

    const deleteBtn = document.getElementById('task-details-delete-btn');
    deleteBtn.setAttribute('onclick', `deleteTask('${taskId}')`);
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

    const title = document.getElementById('task-details-title');
    title.innerHTML = '';

    const description = document.getElementById('task-details-description');
    description.value = '';

    const deadline = document.getElementById('task-details-date');
    deadline.innerHTML = '';

    const priority = document.getElementById('details-priority-text');
    const priorityImg = document.getElementById('details-priority-img');
    priority.innerHTML = '';
    priorityImg.src = ``;

    const assignedToDetails = document.getElementById('details-assigned-list');
    assignedToDetails.innerHTML = '';

    const subtaskList = document.getElementById('details-subtasks-list');
    subtaskList.innerHTML = '';

    const deleteBtn = document.getElementById('task-details-delete-btn');
    deleteBtn.setAttribute('onclick', `deleteTask('')`);
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
        target.insertAdjacentHTML('beforeend', `
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
    `);
    document.getElementById(`edit-add-subtask${specialTarget}`).value = '';
    }
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
            targetLocation.insertAdjacentHTML('beforeend', `
            <div class="details__subtask">
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
            </div>
            `);
        }
    } else {
        noSubtasksAttached();
        data.subtasks && console.warn('Firebase issue. Pls ensure to save JSON-Arrays or nothing in subtasks. Strings will not be displayed!');
    }
}

function noSubtasksAttached() {
    const targetLocation = document.getElementById('details-subtasks-list');
    targetLocation.innerHTML = "This Task has no Subtasks.";
}