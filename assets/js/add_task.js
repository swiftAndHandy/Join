let addTaskTitle = "";
let addTaskDescription = "";
let addTaskAssignedContacts = [];
let addTaskDueDate = "";
let addTaskPrio = "";
let addTaskCategory = "";
let taskStatus = "todo";
let alreadyOpen = false;
pressedButton = 0;
previousButton = 0;
styledCheckbox = [];


function init() {
  includeHTML();
  renderContactList();
  stopEnterForm ();
  setupListenerForAddTasks();
  addEntertoSubTasks ();
  
}

/**
 * Retrieves the value of the input field with the ID 'task-due-date'
 * and assigns it to the variable addTaskDueDate.
 * 
 */
function formOfDueDate() {
  addTaskDueDate = document.getElementById('task-due-date').value
}


function addTitle() {
  let title = document.getElementById("task-title");
  addTaskTitle = title.value;

}


function addDescription() {
  let taskDescription = document.getElementById("task-description");
  addTaskDescription = taskDescription.value;

}


/**
 * 
 * @returns {void}
 * @param {HTMLInputElement} checkbox Contains the value of the checked element from the form tag with the id="form-desktop"
 * @param {number} idNumber Uses a number from a for-loop to assign individual IDs.
 */
function handleCheckBox(checkbox, idNumber) {
  if (checkbox.checked) {
    if (!addTaskAssignedContacts.includes(checkbox.value)) {
      addTaskAssignedContacts.push(checkbox.value);
      styledCheckbox.push(idNumber);
      
    }
    pressedCheckBoxStyle(idNumber);
    
  } else {
    const valueIndex = addTaskAssignedContacts.indexOf(checkbox.value);
    if (valueIndex > -1) {
      addTaskAssignedContacts.splice(valueIndex, 1);
    }
    unPressedCheckBoxStyle(idNumber);
  }
  generateCircleProfilesLine()
  console.log('Aktuelle ausgewählte Kontakte: ', addTaskAssignedContacts);
}


function pressedCheckBoxStyle(idNumber) {
  document.getElementById(`label-check${idNumber}`).classList.add('filter-to-white')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('ul-content-wrapper-no-click')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('pressed-drop-box-bg-color');

}


function unPressedCheckBoxStyle(idNumber) {
  document.getElementById(`label-check${idNumber}`).classList.remove('filter-to-white')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('ul-content-wrapper-no-click')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('pressed-drop-box-bg-color');

}


function toggleContactDropBox(forcedClose = false) {
  if (!alreadyOpen && forcedClose === false) {
    document.getElementById('contacts-drop-menu').classList.remove('d-none');
    document.getElementById('required-text-span').classList.add('d-none');
    document.getElementById('contact-input-wrapper').classList.add('d-none');
    document.getElementById('contacts-show-input').classList.remove('d-none');
    alreadyOpen = true
  } else {
    document.getElementById('contacts-drop-menu').classList.add('d-none');
    document.getElementById('required-text-span').classList.remove('d-none');
    document.getElementById('contact-input-wrapper').classList.remove('d-none');
    document.getElementById('contacts-show-input').classList.add('d-none');
    alreadyOpen = false
  }
}


function clearInputs(event) {
  event.preventDefault()
  let form = document.getElementById('form-desktop')
  form.setAttribute('novalidate', true);

  setTimeout(() => {
    form.removeAttribute('novalidate', false);
  }, 100);
  form.reset();
 
}


function stopStandartValidationMessage(event) {
  event.preventDefault()
  let form = document.getElementById('form-desktop')
  form.setAttribute('novalidate', true);
  setTimeout(() => {
    form.removeAttribute('novalidate', false);
  }, 100);
}


function clearForm (event) {
  clearInputs(event);
  clearFormPrio();
  clearFormContactStyle();
  clearSubtasksContainer();
  if (window.location.pathname === '/board.html')  {
    clearSubtasksContainerDialog()
  }
 
}


function clearFormPrio() {
 pressedButton = 0;
 previousButton = 0;
 addTaskPrio = 'Low';
 const priorities = ["urgent", "medium", "low"];
 const colors = ["orange", "yellow", "green"];
 
 priorities.forEach((priority, index) => {
   document.getElementById(`${priority}-prio`).classList.remove(`pressed-color-${colors[index]}`);
   document.getElementById(`${priority}-prio-img`).classList.remove("pressed-prio-img");
 });

}


function clearFormContactStyle() {
  styledCheckbox.forEach(checkboxId => {
    const label = document.getElementById(`label-check${checkboxId}`);
    const background = document.getElementById(`background-drop-menu-background${checkboxId}`);

    if (label) {
      label.classList.remove('filter-to-white');
    }
    if (background) {
      background.classList.add('ul-content-wrapper-no-click');
      background.classList.remove('pressed-drop-box-bg-color');
    }
  });
  document.getElementById('contacts-img-line').innerHTML = "";
  addTaskAssignedContacts = [];
  styledCheckboxes = [];
}

function convertArrayToObject(array) {
  let obj = {};
  array.forEach((value, index) => {
    obj[index] = value;
  });
  return obj;
}


async function addnewTask() {
  const addTaskSubTask = createSubtasks();
  addTitle();
  addDescription();
  taskDueDate();
  formOfDueDate();
  
  let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);

  await postData({
    'title': addTaskTitle,
    'description': addTaskDescription,
    'assigned': assignedContactsObject,
    'date': addTaskDueDate,
    'priority': addTaskPrio,
    'tag': addTaskCategory,
    'subtasks': addTaskSubTask,
    'status': taskStatus,
  }, 'tasks');
}


function checkIfFormFilled(event) {
  const form = document.getElementById("form-desktop");
  const requiredFields = form.querySelectorAll("[required]");
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
    }
  });
  if (allFilled) {
    addnewTask(event);
    showPopupTaskAdded();
    clearForm(event);
  } else {
    stopStandartValidationMessage(event);
    ownValidation();
    checkCategoryfield ();
  }
}


function setPrio(prio, number) {
  const priorities = ["urgent", "medium", "low"];
  const colors = ["orange", "yellow", "green"];

  priorities.forEach((priority, index) => {
    document.getElementById(`${priority}-prio`).classList.remove(`pressed-color-${colors[index]}`);
    document.getElementById(`${priority}-prio-img`).classList.remove("pressed-prio-img");
  });

  if (number === previousButton) {
    addTaskPrio = "Low";
    previousButton = 0;
  } else {
    addTaskPrio = prio;
    previousButton = number;
  }

  if (previousButton > 0 && previousButton <= priorities.length) {
    const currentPriority = priorities[previousButton - 1];
    const currentColor = colors[previousButton - 1];

    document.getElementById(`${currentPriority}-prio`).classList.add(`pressed-color-${currentColor}`);
    document.getElementById(`${currentPriority}-prio-img`).classList.add("pressed-prio-img");
  }
}


function showPopupTaskAdded() {
  const popup = document.getElementById('pop-up-transition'); 

  popup.style.display = "flex";
  setTimeout(() => {
    popup.classList.add('form-down-to-up-transition');

    setTimeout(() => {
      popup.classList.remove('form-down-to-up-transition');
      popup.style.display = "none";
      window.location.href = 'board.html';
    }, 1000);
  }, 100);
}


async function renderContactList() {
  let contacts = await readData('contacts');
  contacts = setPrefixToKey('contacts', contacts);
  let accounts = await readData('accounts');
  accounts = setPrefixToKey('accounts', accounts);
  let data = {}; await Object.assign(data, accounts, contacts);
  let entries = sortByAlphabet(data);
  let dataKeys = Object.keys(data);
  for (let i = 0; i < entries.length; i++) {
    generateDropBoxContacts(entries[i], dataKeys[i]);
  }
}


function searchContact(search) {
  const contactNames = Array.from(document.querySelectorAll('div.group-pb-cricle-with-name'));
  contactNames.forEach(item => {
    const contactName = item.textContent.trim().toLowerCase();
    const isVisible = contactName.includes(search.toLowerCase());
    hideWindow(item.parentElement.id, !isVisible);
  });
}


 function toggleCategoryDropBox() {
  if (!alreadyOpen) {
    document.getElementById('arrow').classList.remove('rotation-back');
    document.getElementById('category-drop-menu').classList.remove('d-none');
    document.getElementById('arrow').classList.add('rotation');
    document.getElementById('select-category').classList.remove('d-none');
    alreadyOpen = true
  } else {
    document.getElementById('category-drop-menu').classList.add('d-none');
    document.getElementById('arrow').classList.remove('rotation');
    document.getElementById('arrow').classList.add('rotation-back');
    checkCategoryfield()
    alreadyOpen = false
  }
}


function selectCategory (category) {
 addTaskCategory = category
  const parent = document.getElementById('select-category');
  const spanElement = parent.querySelector('span');
  spanElement.textContent = `${category}`;
 toggleCategoryDropBox();
}


  function ownValidation() {
    const form = document.querySelector('#form-desktop');
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      
        if (field.value.trim() === '' && !field.parentNode.querySelector('.error-message')) {
            const errorMessage = document.createElement('span');
            errorMessage.textContent = 'This field ist required.';
            errorMessage.classList.add('error-message'); 
            field.parentNode.appendChild(errorMessage);
        }
        field.addEventListener('input', function() {
            if (field.value.trim() !== '') {
            
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
  }


  function checkCategoryfield () {
    const selectCategoryDiv = document.getElementById('category-input-wrapper');
      const selectedCategory = selectCategoryDiv.innerText.trim();
      if (selectedCategory !== 'Technical Task' && selectedCategory !== 'User Story') {
          if (!selectCategoryDiv.parentNode.querySelector('.error-message')) {
              const errorMessage = document.createElement('span');
              errorMessage.textContent = 'This field ist required.';
              errorMessage.classList.add('error-message');
              selectCategoryDiv.parentNode.appendChild(errorMessage);
          }
      } else {
          const errorMessage = selectCategoryDiv.parentNode.querySelector('.error-message');
          if (errorMessage) {
              errorMessage.remove();
          }
      }

  }


  function removeValidation() {
    const form = document.querySelector('#form-desktop');
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    const selectCategoryDiv = document.getElementById('category-input-wrapper');
    const errorMessageCategory = selectCategoryDiv.parentNode.querySelector('.error-message');
    if (errorMessageCategory) {
        errorMessageCategory.remove();
    }
  }


  function stopEnterForm() {
    const form = document.getElementById('form-desktop');

    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !textAreaSelected) {
            event.preventDefault();
        }
    })
  };

  
  function textAreaSelected() {
    return document.getElementById('task-description') === document.activeElement;
  }


  function addEntertoSubTasks () {
    document.getElementById('edit-add-subtask').addEventListener('keypress', handleEnter);
}


  function handleEnter(event) {
    if (event.key === 'Enter') {
      addNewSubtask(document.getElementById('edit-add-subtask').value,'edit-subtask-item-wrapper','div');
      scrollToLastSubtask();blurListener();
      hideWindow('padding-placeholder');
    }
  }

  function clearSubtasksContainer() {
    document.getElementById('edit-subtask-item-wrapper').innerHTML = "";

  }

  function clearSubtasksContainerDialog() {
    document.getElementById('edit-subtask-item-wrapper-dialog').innerHTML = "";
  }