let addTaskAssignedContacts = [];
let addTaskAssignedOverflow = [];
let addTaskPrio = "Medium";
let addTaskCategory = "";
let taskStatus = "todo";
let alreadyOpen = false;
pressedButton = 0;
previousButton = 3;
styledCheckbox = [];

/**
 * Initializes necessary functions to ensure proper display and form validation.
 * This includes importing HTML content, rendering the contact list,
 * preventing form submission on Enter key press,
 * setting up listeners for adding tasks, and enabling Enter key functionality for subtasks.
 */
function init() {
  includeHTML();
  renderContactList();
  stopEnterForm();
  setupListenerForAddTasks();
  addEntertoSubTasks();
  onStartSelectMediumPrio()
  catgeoryClickOutsideclose()
  setDateMin()
}


/**
 * sets the low pro button to always selected at start.
 */
function onStartSelectMediumPrio() {
  document.getElementById("medium-prio").classList.add("pressed-color-yellow"); // Update class for medium priority
  document.getElementById("medium-prio-img").classList.add("pressed-prio-img"); // Update class for medium priority
}

/**
 * 
 * @param {HTMLInputElement} checkbox - Contains the value of the checked element from the form tag with the id="form-desktop"
 * @param {string}  idNumber - gives the path back of an object
 */
function handleCheckBox(checkbox, idNumber) {
  if (checkbox.checked) {
    if (!addTaskAssignedContacts.includes(checkbox.value)) {
      pressedCheckBoxStyle(idNumber);
      generateCircleProfilesLine(idNumber, true);
      addTaskAssignedContacts.push(checkbox.value);
      styledCheckbox.push(idNumber);
    }
  } else {
    const valueIndex = addTaskAssignedContacts.indexOf(checkbox.value);
    if (valueIndex > -1) {
      unPressedCheckBoxStyle(idNumber);
      generateCircleProfilesLine(idNumber, false);
      addTaskAssignedContacts.splice(valueIndex, 1);
    }
  }
}


/**
 * Implements the styling of the checkboxes when pressed.
 * @param {string} idNumber - The path identifier of an object.
 */
function pressedCheckBoxStyle(idNumber) {
  document.getElementById(`label-check${idNumber}`).classList.add('filter-to-white')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('ul-content-wrapper-no-click')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('pressed-drop-box-bg-color');

}


/**
 * removes the checkbox styling after uncheck them
 * @param {*} idNumber 
 */
function unPressedCheckBoxStyle(idNumber) {
  document.getElementById(`label-check${idNumber}`).classList.remove('filter-to-white')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('ul-content-wrapper-no-click')
  document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('pressed-drop-box-bg-color');

}


/**
 * Toggles the visibility of the contact drop-down menu.
 * @param {boolean} [forcedClose=false] - Flag indicating if the drop-down should be forcefully closed.
 */

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


/**
 * Clears the inputs in the form with the id 'form-desktop' and prevents the form's standard validation
 * with a timeout to ensure the site is not reloaded.
 * 
 * @param {Event} event - The event object triggered when the form is submitted.
 */
function clearInputs(event) {
  event.preventDefault()
  let form = document.getElementById('form-desktop')
  form.setAttribute('novalidate', true);

  setTimeout(() => {
    form.removeAttribute('novalidate', false);
  }, 100);
  form.reset();

}

/**
 * Removes the standard validation message
 * @param {Event} event 
 */

function stopStandardValidationMessage(event) {
  event.preventDefault()
  let form = document.getElementById('form-desktop')
  form.setAttribute('novalidate', true);
  setTimeout(() => {
    form.removeAttribute('novalidate', false);
  }, 100);
}


/**
 * Calls all clear functions to ensure the clear button clears everything including styling.
 * 
 * @param {Event} event - The event object triggered when the clear button is clicked.
 */
function clearForm(event) {
  clearInputs(event);
  clearFormPrio();
  clearFormContactStyle();
  clearSubtasksContainer();
  if (window.location.pathname === '/board.html') {
    clearSubtasksContainerDialog()
  }

}


/**
 * Clears the form styling after pressing the clear button 
 */

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


/**
 * Clears the checkbox styles and resets the associated values after removing them.
 */

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
  addTaskAssignedOverflow = [];
  styledCheckboxes = [];
}


/**
 * Converts an array into an object where array values become object properties.
 * @param {array} array The array to be converted into an object.
 * @returns {object} The resulting object with numeric indices as keys.
 */
function convertArrayToObject(array) {
  let obj = {};
  array.forEach((value, index) => {
    obj[index] = value;
  });
  return obj;
}


/**
 * Posts a new task to the backend.
 * Collects task data from form inputs and sends it via POST request to the backend API.
 * @returns {Promise<void>} A promise that resolves when the task is successfully posted.
 */
async function addnewTask() {
  const addTaskSubTask = createSubtasks();
  let assignedContactsObject = convertArrayToObject(addTaskAssignedContacts);

  await postData({
    'title': document.getElementById('task-title').value,
    'description': document.getElementById('task-description').value,
    'assigned': assignedContactsObject,
    'date': isNotInPast(document.getElementById('task-due-date').value),
    'priority': addTaskPrio,
    'tag': addTaskCategory,
    'subtasks': createSubtasks(),
    'status': taskStatus,
  }, 'tasks');
}


/**
 * Checks if the form is completely filled and validates whether the form is ready to submit or not.
 * If all required fields are filled and a category is selected, the new task is added, a success popup is shown,
 * and the form is cleared.
 * If not all required fields are filled or no category is selected, standard form validation messages are stopped,
 * custom validation is performed, and category field is checked.
 * @param {Event} event The event object, typically from a form submission.
 */
function checkIfFormFilled(event) {
  const form = document.getElementById("form-desktop");
  const requiredFields = form.querySelectorAll("[required]");
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
    }
  });
  const selectedCategory = document.getElementById("selected-category");
  if (selectedCategory.textContent.trim() === "Select category") {
    allFilled = false;
  }
  if (allFilled) {
    allFilledTrue(event);
  } else {
    allFilledFalse(event);
  }
}


/**
 * When allfilled is true this function will trigger
 * @param {Event} event 
 */
function allFilledTrue(event) {
  addnewTask(event);
  showPopupTaskAdded();
  clearForm(event);
}


/**
 * When allfilled is false this function will trigger
 * @param {Event} event 
 */
function allFilledFalse(event) {
  stopStandardValidationMessage(event);
  ownValidation();
  checkCategoryfield();
}


/**
 * Sets the priority of a task and updates its visual styling when clicked.
 * Clears previous selections and applies the selected priority and its corresponding color.
 * @param {string} prio- The priority level, one of "urgent", "medium", or "low".
 * @param {number} number - number The index of the priority button clicked to determine which priority to set
 */
function setPrio(prio, number) {
  const priorities = ["urgent", "medium", "low"];
  const colors = ["orange", "yellow", "green"];
  priorities.forEach((priority, index) => {
    document.getElementById(`${priority}-prio`).classList.remove(`pressed-color-${colors[index]}`);
    document.getElementById(`${priority}-prio-img`).classList.remove("pressed-prio-img");
  });
  addTaskPrio = prio;
  previousButton = number;
  if (previousButton > 0 && previousButton <= priorities.length) {
    const currentPriority = priorities[previousButton - 1];
    const currentColor = colors[previousButton - 1];
    document.getElementById(`${currentPriority}-prio`).classList.add(`pressed-color-${currentColor}`);
    document.getElementById(`${currentPriority}-prio-img`).classList.add("pressed-prio-img");
  }
}


/**
 * Display the successfully created a task pop-up with a little animation
 */

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


/**
 * Fetches contact and account data from the backend, processes it, and renders
 * the contact list in the drop-box.
 */
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


/**
 * Filters contact elements based on the search term and toggles their visibility.
 * Elements with class 'group-pb-cricle-with-name' are iterated over and displayed
 * based on whether their text content matches the search term.
 * 
 * @param {string} search The search term to filter contact elements.
 */
function searchContact(search) {
  const contactNames = Array.from(document.querySelectorAll('div.group-pb-cricle-with-name'));
  contactNames.forEach(item => {
    const contactName = item.textContent.trim().toLowerCase();
    const isVisible = contactName.includes(search.toLowerCase());
    hideWindow(item.parentElement.id, !isVisible);
  });
}

/**
 * Open or close the category drop-box when clicked
 */
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


/**
 * Sets the selected category for the task and updates the displayed category text.
 * Closes the category drop-down box after selection.
 * 
 * @param {string} category - The category selected for the task.
 */
function selectCategory(category) {
  addTaskCategory = category;
  document.getElementById('selected-category').textContent = `${category}`;
  toggleCategoryDropBox();
}


/**
 * Clears the subtask container when the clear button is clicked.
 */
function clearSubtasksContainer() {
  document.getElementById('edit-subtask-item-wrapper').innerHTML = "";
  document.getElementById('padding-placeholder').classList.remove('d-none')
}


/**
 * Clears the subtask container in the board add task dialog field.
 */
function clearSubtasksContainerDialog() {
  document.getElementById('edit-subtask-item-wrapper-dialog').innerHTML = "";
}

