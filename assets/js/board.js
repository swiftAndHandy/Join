currentlyDragged = null;
currentlyDraggedCategory = null;


function initBoard() {
  includeHTML();
  renderTasks();
  addOpenAddTaskToButtons()
  document.addEventListener('dragend', () => {
    currentlyDragged = null;
    currentlyDraggedCategory = null;
  });
}


function updateBoard(deleteItem, fromLocation, targetLocation) {
  const transfer = document.getElementById(`taskId${deleteItem}`);
  document.getElementById(`taskId${deleteItem}`).remove();
  document.getElementById(`${targetLocation}-field`).insertAdjacentElement('beforeend', transfer);
  transfer.setAttribute('ondragstart', `startDrag('${deleteItem}', '${targetLocation}')`);
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
        toDoField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.category, item.subTasks);
      }
      if (item.status == "progress") {
        inProgressField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.category, item.subTasks);
      }
      if (item.status == "feedback") {
        awaitFeedbackField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.category, item.subTasks);
      }
      if (item.status == "done") {
        doneField.innerHTML += generateTaskCard(key, item.status, item.title, item.description, item.date, item.prio, item.category, item.subTasks);
      }

    }
    updateTaskFields(['todo', 'progress', 'feedback', 'done']);
  } catch (error) {
    console.error(error);
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

async function moveTo(newLocation) {
  const item = currentlyDragged;
  const from = currentlyDraggedCategory;
  if (item) {
    await putData(newLocation, `tasks/${item}/status`);
    updateBoard(item, from, newLocation);
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


