// Checkbox must become active also, when contact is currently assigned
function generateContactsHtml(data) {
    const target = document.getElementById('edit-task-contacts-list');
    target.innerHTML += `
        <div id="assign-contact-${data.path}" class="single-contact" onclick="toggleThis('${data.path}')">
            <div class="user-box">
                <div id="edit-task-avatar-${data.id}" class="avatar at-drop-down" style="background-color: ${data['color']};">${initials(data.name)}</div>
                    <span id="edit-task-username-${data.id}">${data.name}</span>
                </div>
            <div id="assign-contact-pseudo-checkbox-${data.path}" class="pseudo-checkbox">
            </div>
                <input type="checkbox" class="contact-checkbox" id="assign-contact-checkbox-${data.path}" name="example-checkbox">
                <label for="assign-contact-checkbox-${data.path}"></label>
        </div>
        `;
}

async function generateTaskDetailsHtml(taskId, taskDetails) {
    const tag = document.getElementById('task-details-tag');
    tag.innerHTML = taskDetails['category'];
    taskDetails['category'] === 'User Story' ? tag.setAttribute('class', 'tag user-story') : tag.setAttribute('class', 'tag technical-task')

    const title = document.getElementById('task-details-title');
    title.innerHTML = taskDetails['title'];

    const description = document.getElementById('task-details-description');
    description.innerHTML = taskDetails['description']

    const deadline = document.getElementById('task-details-deadline');
    deadline.innerHTML = taskDetails['date'].split('-').join('/');

    const priority = document.getElementById('details-priority-text');
    const priorityImg = document.getElementById('details-priority-img');
    priority.innerHTML = taskDetails['prio'];
    priorityImg.src = `../assets/img/icons/priority_${taskDetails['prio'].toLowerCase()}.svg`;

    const assignedTo = document.getElementById('details-assigned-list');
    assignedTo.innerHTML = await assignedPersonsHtml(taskDetails['contacts']);

    const deleteBtn = document.getElementById('task-details-delete-btn');
    deleteBtn.setAttribute('onclick', `deleteTask(${taskId})`);
}

async function assignedPersonsHtml(contactIds) {
    const data = await readData(`contacts`);
    let output = '';
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        try {
            if (contactIds.includes(keys[i])) {
                output += `
                <div class="details__inner">
                <div id="edit-task-avatar-ID" class="avatar at-drop-down" style="background-color: ${data[keys[i]].color};">${initials(data[keys[i]].name)}</div>
                    <span id="edit-task-username-ID">${data[keys[i]].name}</span>
                </div>
                `;
            }
        } catch (error) {}
    }
    return output;
}

function addNewSubtask(value) {
    const target = document.getElementById('edit-subtask-item-wrapper');
    const id = Math.random().toString(36).substr(2, 9) + '-' + Date.now();

    target.insertAdjacentHTML('beforeend',`
    <div id="edit-subtask-total-${id}" class="li-wrapper"
        ondblclick="openSubtaskInput('edit-subtasks-unsorted-${id}');stopPropagation(event);">
        <ul id="edit-subtasks-unsorted-${id}" class="edit-subtasks-list"">
                                    <li>
                                        <div class=" single-list-item">
            <span class="subtaskitem">${value}</span>
            <div class="hover-overlay" onclick="stopPropagation(event)">
                <img src="./assets/img/icons/edit.svg" alt="" onclick="openSubtaskInput('${id}')">
                <div class="vertical-line"></div>
                <img src="./assets/img/icons/delete.svg" alt="" onclick="deleteSubtask('${id}');">
            </div>
    </div>
    </li>
    </ul>
    </div>
    <div id="single-subtask-input-wrapper-${id}" class="single-subtask-input-box d-none">
        <input id="single-subtask-input-subtaskId" type="text">
        <img class="link-btn discard-btn" src="./assets/img/icons/discard.svg" alt=""
            onclick="discardSubtaskInput('${id}')">
        <div class="vertical-line"></div>
        <img class="link-btn accept-btn" src="./assets/img/icons/check_blue.svg" alt=""
            onclick="updateSubtaskInput('${id}')">
    </div>
    `);
}