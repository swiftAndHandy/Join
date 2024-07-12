function stopEnterForm() {
    const form = document.getElementById('form-desktop');

    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !isSubtaskInputFocused() && !textAreaSelected()) {
            event.preventDefault();
        }
    });
}

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


  function textAreaSelected() {
    return document.getElementById('task-description') === document.activeElement;
  }

  function addEntertoSubTasks(event, id) {
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


function handleEnter(event, id) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const subtaskInput = document.getElementById('edit-add-subtask');

    if (subtaskInput) {
      const inputValue = subtaskInput.value;

      if (window.location.pathname === '/add_task.html') {
        addNewSubtask(inputValue, 'edit-subtask-item-wrapper', 'div');
        scrollToLastSubtask();
        blurListener();
        hideWindow('padding-placeholder');
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