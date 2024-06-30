let editPriority;

function toggleThis(id) {

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

/**
 * @param {string} id - id of the html element that should become toggle of display: none 
 * @param {boolean} [method = true] - If true, adds the 'd-none' class to hide the element. If false, removes the 'd-none' class to show the element.
 */
function hideWindow(id, method = true) {
    target = document.getElementById(id);
    method ? target.classList.add('d-none') : target.classList.remove('d-none');
}