/**
 * Prevents form submission on Enter key press after checking if the requirements are met.
 * Enter is not allowed when neither isSubtaskInputFocused nor textAreaSelected are true.
 */
function stopEnterForm() {
    const form = document.getElementById('form-desktop');
    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !isSubtaskInputFocused() && !textAreaSelected()) {
            event.preventDefault();
        }
    });
}


/**
 * Checks if any subtask input field is focused.
 * The function searches for elements with specific IDs and checks if one of them is the active element.
 * 
 * @returns {boolean} True if any subtask input field is focused, otherwise false.
 */
function isSubtaskInputFocused() {
    const subtaskInput = document.getElementById('edit-add-subtask');
    const subtaskDialogInput = document.getElementById('edit-add-subtask-dialog');
    const singleSubtaskInputs = document.querySelectorAll('[id^=single-subtask-input-]');
    if (subtaskInput && subtaskInput === document.activeElement) {
        return true;
    }
    if (subtaskDialogInput && subtaskDialogInput === document.activeElement) {
        return true;
    }
    for (let i = 0; i < singleSubtaskInputs.length; i++) {
        if (singleSubtaskInputs[i] === document.activeElement) {
            return true;
        }
    }
    return false;
}


/**
 * Checks if the textarea with the ID 'task-description' is the active element.
 * This ensures that the Enter key is not blocked when typing in this textarea.
 * 
 * @returns {boolean} True if the 'task-description' textarea is the active element, otherwise false.
 */
  function textAreaSelected() {
    return document.getElementById('task-description') === document.activeElement;
  }


 /**
 * Adds an event listener to subtask input fields to handle Enter key presses.
 * 
 * @param {string} id - The unique identifier for the subtask input wrapper.
 */
  function addEntertoSubTasks(id) {
    const subtaskInput = document.getElementById('edit-add-subtask');
    const subtaskDialog = document.getElementById('edit-subtask-box-dialog');
    if (subtaskInput) {
      subtaskInput.addEventListener('keypress', (event) => handleEnter(event, id));
    }
    if (window.location.pathname === '/board.html' && subtaskDialog) {
      subtaskDialog.addEventListener('keypress', (event) => handleEnter(event, id));
    }
    const singleSubtaskInputWrapper = document.getElementById(`single-subtask-input-wrapper-${id}`);
    if (singleSubtaskInputWrapper) {
      singleSubtaskInputWrapper.addEventListener('keypress', (event) => handleEnter(event, id));
    }
  }

  
/**
 * Handles the Enter key press event, preventing the default form submission if certain conditions are met.
 * If Enter is pressed within the form-desktop element, it performs specific actions based on the current page.
 * 
 * @param {Event} event - The event object from the key press.
 * @param {string} id - The unique identifier for the subtask input wrapper.
 */
function handleEnter(event, id) {
    if (event.key === 'Enter' && event.target.closest('#form-desktop')) {
    event.preventDefault();
    const subtaskInput = document.getElementById('edit-add-subtask');
    if (subtaskInput) {
      const inputValue = subtaskInput.value;
      if (window.location.pathname === '/add_task.html') {
        addNewSubtask(inputValue, 'edit-subtask-item-wrapper', 'div'); scrollToLastSubtask(); blurListener(); hideWindow('padding-placeholder');
      }
      if (window.location.pathname === '/board.html') {
     addNewSubtask(document.getElementById('edit-add-subtask-dialog').value,'edit-subtask-item-wrapper-dialog','div', '-dialog');scrollToLastSubtask('-dialog');blurListener();
      }
    } else {
      console.error('Cannot find subtask input element');
    }
    const editSubtaskInput = document.getElementById(`single-subtask-input-${id}`);
    if (editSubtaskInput) {
      updateSubtaskInput(id);
    }
  }
}