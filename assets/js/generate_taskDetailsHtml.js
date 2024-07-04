function generateContactsHtml(contactId, contactInformation) {
    const target = document.getElementById('edit-task-contacts-list');
    target.innerHTML += `
        <div id="assign-contact-${contactId}" class="single-contact" onclick="toggleThis('${contactId}')">
            <div class="user-box">
                <div id="edit-task-avatar-${contactId}" class="avatar at-drop-down" style="background-color: ${contactInformation['color']};">${initials(contactInformation['name'])}</div>
                    <span id="edit-task-username-${contactId}">${contactInformation['name']}</span>
                </div>
            <div id="assign-contact-pseudo-checkbox-${contactId}" class="pseudo-checkbox">
            </div>
                <input type="checkbox" class="contact-checkbox" id="assign-contact-checkbox-${contactId}" name="example-checkbox">
                <label for="assign-contact-checkbox-${contactId}"></label>
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
                const contactInitials = initials(data[keys[i]].name);
                output += `
                <div class="details__inner">
                <span id="assigned-person-${contactIds}" class="details__information">${data[keys[i]].name}</span>
                </div>
                `;
            }
        } catch (error) {}
    }
    return output;
}