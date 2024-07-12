
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

/**
 * Setup some Listeners, thats needed for Subtasks.
 * It's implemented by Phillip on base of setupListener. 
 */
function setupListenerForAddTasks() {
    let listener = document.getElementById('edit-add-subtask');
    listener.addEventListener('focus', focusListener);
    listener.addEventListener('blur', blurListener);
}

/**
 * Setup some Listeners, thats needed for Subtasks.
 * It's implemented by Phillip on base of setupListener. 
 */
function setupListenerForAddTasksDialog() {
    let listener = document.getElementById('edit-add-subtask-dialog');
    listener.addEventListener('focus', focusListenerDialog);
    listener.addEventListener('blur', blurListenerDialog);

    document.getElementById('task_add-popup-dialog').addEventListener('click', toggleContactDropBox);
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


/**
 * Change Button-Design based on focus of input-field. 
 * Show discard and save-button, when input for new subtask is active
 */
function focusListenerDialog() {
    document.getElementById('edit-subtask-box-dialog').classList.add('focus');
    hideWindow('edit-view-subtask-navigation-dialog', false);
    hideWindow('edit-view-subtask-add-dialog');
}


/**
 * Change Button-Design based on focus of input-field. 
 * Hide discard and save-button, when input for new subtask is active
 * Show add button instead.
 */
function blurListenerDialog() {
    let listener = document.getElementById('edit-add-subtask-dialog')
    document.getElementById('edit-subtask-box-dialog').classList.remove('focus');
    if (!listener.value) {
        hideWindow('edit-view-subtask-navigation-dialog');
        hideWindow('edit-view-subtask-add-dialog', false);
    }
}