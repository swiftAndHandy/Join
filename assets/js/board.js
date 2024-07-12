let currentlyDragged = null;
let currentlyDraggedCategory = null;


/**
 * Initializing the Board by running various functions
 */
async function initBoard() {
  await includeHTML();
  renderTasks();
  addOpenAddTaskToButtons()
  renderContactList();
  stopEnterForm();
  setupListenerForAddTasks();
  setupListenerForAddTasksDialog();

  document.addEventListener('dragend', () => {
    if (currentlyDragged !== null) {
      rotateTaskDragEnd(currentlyDragged);
    }
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
      const target = statusFields[item.status];
      generateTaskCard(key, item, target);
      updateTaskFields(Object.keys(statusFields));
      priorityEqualImg(item.priority, key);
      setBottomTaskCardVisibility(item, key);
    }
  } catch (error) {
    console.error('Error rendering tasks:', error);
  }
}


/**
 * Sets the priority image of the target to a lowercase-variant of priority-param
 * @param {string} priority - Urgent, Medium or Low
 * @param {*string} key - key of current task
 */
function priorityEqualImg(priority, key) {
  priority = priority.toLowerCase();
  const target = document.getElementById(`prio-img${key}`);
  target.src = `./assets/img/icons/priority_${priority}.svg`;
}


/**
 * Display or hide the Bottom-DIV of a task-card at the board
 * @param {*} card 
 * @param {*} taskId 
 */
function setBottomTaskCardVisibility(card, taskId) {
  if (emptyBottomOf(card)) {
    document.getElementById(`bottom-board-card-wrapper${taskId}`).classList.add('d-none');
  } else {
    document.getElementById(`bottom-board-card-wrapper${taskId}`).classList.remove('d-none');
  }
}


/**
 * @param {object} card - contains all card information
 * @returns {boolean} - true if (card.assigned is unset or an empty[]) and also(!) 
 *                    there is no card.priority set or the card.priority is an empty string
 */
function emptyBottomOf(card) {
  return (!card.assigned || card.assigned.length === 0) && (!card.priority || card.priority==='');
}


/**
 * Prevents default behaviour
 * @param {DragEvent} ev - DravEvent listener
 */
function allowDrop(ev) {
  ev.preventDefault()
}


/**
 * Sets global Variables that are required for an proper drag-process.
 * @param {string} id - id of the task that is dragged. will be set to a global.
 * @param {*} fromCategory - the category of the currently dragged item, will be set to a global.
 */
function startDrag(id, fromCategory) {
  currentlyDragged = id;
  currentlyDraggedCategory = fromCategory;
  rotateTaskDragStart(id);
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
    rotateTaskDragEnd(item);
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


/**
 * calls hideWindow for every section. if the innerHTML without leading and trailing spaces is
 * empty the comparsion is false, to the oposite of hideWindow -> showWindow will happen. 
 * Otherwise the message must become hidden.
 * @param {Array} sections - contains all sections of the board, so that they can be iterated. 
 */
function updateTaskFields(sections) {
  for (let item in sections) {
    hideWindow(`task-field-${sections[item]}`, document.getElementById(`${sections[item]}-field`).innerHTML.trim() !== "");
  }
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
function addOpenAddTaskToButtons() {
  const buttons = document.querySelectorAll(
    "button.add-cross-btn-small, button.add-task-btn, button.add-cross-btn"
  );
  buttons.forEach((button) => {
    button.setAttribute("onclick", "handleButtonClickOnWidth()");
  });
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
function handleButtonClickOnWidth() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 1160) {
    return switchToAddTask();
  } else {
    return openAddTask();
  }
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
function openAddTask() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.add("transition-right");
  applyGreyScreen();
  document.body.classList.add('overflow-all-hidden');
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
function switchToAddTask() {
  let addTaskUrl = "../add_task.html";
  window.location.href = addTaskUrl;
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
function closeAddTaskPopUp(event) {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.remove("transition-right");
  applyGreyScreen();
  document.body.classList.remove('overflow-all-hidden');
  removeValidation();
  clearFormPrio();
  clearFormContactStyle();
  document.getElementById('form-desktop').reset()
}


/**
 * Pls write your own JSdoc, Phillip
 * this should be (only) your function
 */
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
function limitLengthOf(inputString, limit = 80) {
  if (inputString.length > limit) {
    return inputString.substring(0, limit) + '...';
  }
  return inputString;
}


/**
 * I'll add this later. --Andre
 */
function rerenderTaskOnBoard(data, taskId) {
  const description = document.getElementById(`description-content${taskId}`);
  const hiddenDescription = document.getElementById(`hidden-description-content${taskId}`);
  const title = description.previousElementSibling.innerText = data.title;
  description.innerText = limitLengthOf(data.description, 80);
  document.getElementById(`profile-circle-container-${taskId}`).innerHTML = '';
  hiddenDescription.innerText = data.description;
  generateCircleProfiles(data.assigned, taskId);
  getSubtaskProgress(data.subtasks, taskId);
  priorityEqualImg(data.priority, taskId);
  setBottomTaskCardVisibility(data, taskId);
}


/**
 * Feel free to write JSdoc, @Phillip.
 * Otherwise i'll can do it later on, since this is based on my search-engine and i've recorded smaller parts.
 * -- Andre
 */
function searchAndShowTasks(searchTerm) {
  const taskCards = document.querySelectorAll('.task-card-container');

  taskCards.forEach(taskCard => {
    const titleElement = taskCard.querySelector('.task-card-header');
    if (titleElement) {
      const title = titleElement.textContent.trim().toLowerCase();
      const isVisible = title.includes(searchTerm.toLowerCase());


      const articleElement = taskCard.closest('article');
      if (articleElement) {
        hideWindow(articleElement.id, !isVisible);
      }
    }
  });
}


/**
 * sets up two counters. one for finished subtasks, and one for the total amount.
 * checks every Object in Object[] and adds 1 to the total amount.
 * if element.done is true, also doneSubtasks increase. 
 * @param {Object[]} subtasks - Every Subtask Object related to the taskId
 * @param {string} taskId - taskId of the currently rendered task
 */
async function getSubtaskProgress(subtasks, taskId) {
  let doneSubtasks = 0; let totalSubtasks = 0;

  if (Array.isArray(subtasks)) {
    subtasks.forEach(element => {
      totalSubtasks++;
      element.done && doneSubtasks++;
    });
  }

  calculateSubtaskProgressOf(taskId, doneSubtasks, totalSubtasks);
}


/**
 * Calculates Percentage of solved Subtasks and changes the Inline-Style of the
 * related Progress bar. Also updates the text.
 * If no subtask is added to the task, hide the progress bar(parents parent element).
 * If a subtask is added to the tash, show parents parent element. This is necessairy, since
 * the object could be d-noned by rendering and need to be displayed after adding a first subtask.
 * @param {string} taskId - ID of the task that should be calculated
 * @param {number} done - amount of completed subtask goals.
 * @param {number} total - total amount of subtasks, added to this taskId
 */
async function calculateSubtaskProgressOf(taskId, done, total) {
  const target = document.getElementById(`progress-length${taskId}`);
  let progress = Number(done * 100 / total).toFixed(0);
  if (!isNaN(progress)) {
    target.style.width = `${progress}%`;
    target.parentElement.nextElementSibling.innerHTML = `${done}/${total} Subtasks`;
    target.parentElement.parentElement.classList.remove('d-none');
  } else {
    target.parentElement.parentElement.classList.add('d-none');
  }
}


/**
 * Applies a rotation-effect on the currently dragged task-card
 */
function rotateTaskDragStart(id) {
  let rotateTask = document.getElementById(`taskId${id}`);
  rotateTask.classList.add('draggable'); 
  rotateTask.style.transform = "rotate(5deg)";
}

/**
 * Removes a rotation-effect on the currently dragged task-card
 */
function rotateTaskDragEnd(id) {
  let rotateTask = document.getElementById(`taskId${id}`);
  rotateTask.classList.remove('draggable'); 
  rotateTask.style.transform = "rotate(0deg)";
}