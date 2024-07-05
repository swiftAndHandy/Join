let currentlyDragged = null;
let currentlyDraggedCategory = null;


function initBoard() {
  includeHTML();
  renderTasks();
  addOpenAddTaskToButtons()
  document.addEventListener('dragend', () => {
    currentlyDragged = null;
    currentlyDraggedCategory = null;
  });
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
  const toDoField = document.getElementById('todo-field');
  const inProgressField = document.getElementById('progress-field');
  const awaitFeedbackField = document.getElementById('feedback-field');
  const doneField = document.getElementById('done-field');

  try {
    let data = await readData('tasks');
    for (let key in data) {
      const item = data[key];
     
      if (item.status == "todo") {
        toDoField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.tag, item.subTasks);
        
      }
     else if (item.status == "progress") {
        inProgressField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.tag, item.subTasks);
      }
     else if (item.status == "feedback") {
        awaitFeedbackField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.tag, item.subTasks);
      }
     else if (item.status == "done") {
        doneField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.tag, item.subTasks);
      }
      prioEqualImg(item ,key);
    }
   
    updateTaskFields(['todo', 'progress', 'feedback', 'done']);
  } catch (error) {
    console.error(error);
  }
}

function prioEqualImg (prio, key) {
  if(prio.priority === 'Urgent') {
   let prioImg = document.getElementById(`prio-img${key}`);
    prioImg.src = "./assets/img/icons/urgent.svg";
  } else if(prio.priority === 'Medium') {
    let prioImg = document.getElementById(`prio-img${key}`);
     prioImg.src = "./assets/img/icons/medium.svg";
}else if(prio.priority === 'Low') {
  let prioImg = document.getElementById(`prio-img${key}`);
   prioImg.src = "./assets/img/icons/low.svg";

}
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
  if (item) {
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

  if (screenWidth < 1260) {
    return switchToAddTask();
  } else {
    return openAddTask();
  }
}

function openAddTask() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.add("transition-right");
  document.getElementById('add-task-transition').classList.add('grey-out-bg');
  document.body.classList.add('overflow-all-hidden');
}

function switchToAddTask() {
  let addTaskUrl = "../add_task.html";
  window.location.href = addTaskUrl;
}

function closeAddTaskPopUp() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.remove("transition-right");
  document.getElementById('add-task-transition').classList.remove('grey-out-bg');
  document.body.classList.remove('overflow-all-hidden');
}

// document.addEventListener("DOMContentLoaded", function () {
//   // Deine Funktion, die beim Laden der Seite aufgerufen wird
//   addOpenAddTaskToButtons(); // Füge onclick zu den Buttons hinzu
// });