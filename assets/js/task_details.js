let editPriority;

function toggleThis(id) {

}

/**
 * Applys d-none to a specific DOM-Object
 * @param {*} id - the DOM-Object on which the d-none-toggle is applied to.
 * @returns 
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

function resetInputFields() {
    id = 'edit';
    hideWindow(`${id}-task-list-btn`, false);
    hideWindow(`${id}-task-list-input`);
    hideWindow(`${id}-task-contacts-list`);
}