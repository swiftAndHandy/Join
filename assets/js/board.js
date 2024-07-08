let currentlyDragged = null;
let currentlyDraggedCategory = null;


async function initBoard() {
  await includeHTML();
  renderTasks();
  addOpenAddTaskToButtons()

  document.addEventListener('dragend', () => {
    showDragArea('', false);
    currentlyDragged = null;
    currentlyDraggedCategory = null;
  });

  initTaskDetails();
}


/**
 * saves the choossen draggable item in transfer. 
 * removes the item from DOM and inserts it at beforeend at the new location
 * than the item recives a new ondragstart functionality with the new location.
 * finally update the task fields to show/hide "no tasks to do"-span.
 * 
 * @param {string} updateItem - part of the id of the dragged element
 * @param {string} fromLocation - current category of the item
 * @param {string} targetLocation - future category of the item
 */
function updateBoard(updateItem, fromLocation, targetLocation) {
  const transfer = document.getElementById(`taskId${updateItem}`);
  document.getElementById(`taskId${updateItem}`).remove();
  document.getElementById(`${targetLocation}-field`).insertAdjacentElement('beforeend', transfer);
  transfer.setAttribute('ondragstart', `startDrag('${updateItem}', '${targetLocation}')`);
  updateTaskFields([fromLocation, targetLocation]);
}

async function renderTasks() {
  const statusFields = {
    'todo': document.getElementById('todo-field'),
    'progress': document.getElementById('progress-field'),
    'feedback': document.getElementById('feedback-field'),
    'done': document.getElementById('done-field')
  };

  try {
    let data = await readData('tasks');

    for (let key in data) {
      const item = data[key];
      const taskCardHTML = await callContactInformationForTasks(key, item);
      updateTaskFields(Object.keys(statusFields));
      statusFields[item.status].innerHTML += taskCardHTML;
      document.getElementById(`profile-circle-container-${key}`).innerHTML = await generateCircleProfiles(item.assigned, key, data);
      prioEqualImg(item.priority, key);
    }
  } catch (error) {
    console.error('Error rendering tasks:', error);
  }
}


/**
/**
 * The function calls generateTaskCard at the end to return the HTML for the task card.
 * It is essential for accessing the contacts database.
 * renderTasks provides the necessary parameters for this function to work with.
 * 
 * @param {string} keyTasks - The unique key from the Tasks database.
 * @param {} item -
 * @returns {Promise<string>} A promise that includes the generated HTML for the task card.
 */
async function callContactInformationForTasks(keyTasks, item) {  // maybe not the right approch should check it tommorw maybe  i have to get the color form the contaacts also in the assigend tab
  let contactData = await readData('contacts');
  const entries = sortByAlphabet(contactData, 'contacts');

  // Generiere die Aufgabenkarte mit den ersten drei Einträgen
  let taskCardHTML = generateTaskCard(keyTasks, item);

  return taskCardHTML;
}




function prioEqualImg(priority, key) {
  priority = priority.toLowerCase();
  const target = document.getElementById(`prio-img${key}`);
  target.src = `./assets/img/icons/priority_${priority}.svg`;
}

function updateAfterDrag() {
  let statusField = key;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function startDrag(id, fromCategory) {
  currentlyDragged = id;
  currentlyDraggedCategory = fromCategory;
}

/**
 * updates the category of a single item via drag and drop
 * @param {string} newLocation - the new location of the item
 */
async function dragTo(newLocation) {
  const item = currentlyDragged;
  const from = currentlyDraggedCategory;
  if (item && currentlyDraggedCategory != newLocation) {
    await putData(newLocation, `tasks/${item}/status`);
    updateBoard(item, from, newLocation);
  }
}

/**
 * allows to update a single item without drag and drop.
 * call this in a button, for example.
 * @param {string} newLocation -new category
 * @param {string} fromLocoation - old category
 * @param {string} thisId - the item that should become moved
 */
async function moveTo(newLocation, fromLocoation, thisId) {
  await putData(newLocation, `tasks/${thisId}/status`);
  updateBoard(thisId, fromLocoation, newLocation);
}

/**
 * 
 * @param {string} targetArea - Section where a drag- and drop-change is required
 * @param {boolean}[display = true] - display drag area by default
 */
function showDragArea(area, display = true) {
  const sections = ['todo', 'progress', 'feedback', 'done'];
  for (let item of sections) {
    if (item === area) {
      document.getElementById(`${area}-section`).classList.add('drag-area');
    } else {
      document.getElementById(`${item}-section`).classList.remove('drag-area');
    }
  }
}

function updateTaskFields(sections) {
  for (let item in sections) {
    hideWindow(`task-field-${sections[item]}`, document.getElementById(`${sections[item]}-field`).innerHTML.trim() !== "");
  }
}

function addOpenAddTaskToButtons() {
  const buttons = document.querySelectorAll(
    "button.add-cross-btn-small, button.add-task-btn, button.add-cross-btn"
  );
  buttons.forEach((button) => {
    button.setAttribute("onclick", "handleButtonClickOnWidth()");
  });
}

function handleButtonClickOnWidth() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 1160) {
    return switchToAddTask();
  } else {
    return openAddTask();
  }
}

function openAddTask() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.add("transition-right");
  applyGreyScreen();
  document.body.classList.add('overflow-all-hidden');
}

function switchToAddTask() {
  let addTaskUrl = "../add_task.html";
  window.location.href = addTaskUrl;
}

function closeAddTaskPopUp() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.remove("transition-right");
  applyGreyScreen();
  document.body.classList.remove('overflow-all-hidden');
}

function applyGreyScreen() {
  const greyScreen = document.getElementById('grey-screen');
  greyScreen.classList.toggle('grey-screen');
  greyScreen.classList.toggle('d-none');
}

/**
 * Limits the length of a string to a chosen limit
 * @param {string} inputString - string, that should become limited in length
 * @param {int} limit - max-length of the string
 * @returns {string} - shortened string
 */
function limitLengthOf(inputString, limit) {
  if (inputString.length > limit) {
    return inputString.substring(0, limit) + '...'; 
  }
  return inputString; 
}