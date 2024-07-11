
/**
 * Setup some Event-Listeners for focus-design on edit-task-details input-fields (contact-search and add-new-subtask)
 */
function setupListener() {
    let listener = document.getElementById('edit-add-subtask');
    listener.addEventListener('focus', focusListener);
    listener.addEventListener('blur', blurListener);

    listener = document.getElementById('edit-task-list-input-field');
    const target = 'edit-task-contact-list-input';
    listener.addEventListener('focus', () => document.getElementById(target).classList.add('focus'));
    listener.addEventListener('blur', () => document.getElementById(target).classList.remove('focus'));
}

function setupListenerForAddTasks() {
    let listener = document.getElementById('edit-add-subtask');
    listener.addEventListener('focus', focusListener);
    listener.addEventListener('blur', blurListener);
}

/**
 * Change Button-Design based on focus of input-field. 
 * Show discard and save-button, when input for new subtask is active
 */
function focusListener() {
    document.getElementById('edit-subtask-box').classList.add('focus');
    hideWindow('edit-view-subtask-navigation', false);
    hideWindow('edit-view-subtask-add');
}


/**
 * Change Button-Design based on focus of input-field. 
 * Hide discard and save-button, when input for new subtask is active
 * Show add button instead.
 */
function blurListener() {
    let listener = document.getElementById('edit-add-subtask')
    document.getElementById('edit-subtask-box').classList.remove('focus');
    if (!listener.value) {
        hideWindow('edit-view-subtask-navigation');
        hideWindow('edit-view-subtask-add', false);
    }
}