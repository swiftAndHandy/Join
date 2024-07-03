currentlyDragged = null;

async function loadData(path = 'tasks') {
  let response = await fetch(base_URL + path + '.json');
  let responseToJson = await response.json();
  console.log(responseToJson);
  return responseToJson;
}

function initBoard() {
  includeHTML();
  initTasks();
  addOpenAddTaskToButtons()
}

async function initTasks() {
  let toDoField = document.getElementById('to-do-field');
  let inProgressField = document.getElementById('in-progress-field');
  let awaitFeedbackField = document.getElementById('await-feedback-field');
  let doneField = document.getElementById('done-field');

  inProgressField.innerHTML = '';
  toDoField.innerHTML = '';
  awaitFeedbackField.innerHTML = '';
  doneField.innerHTML = '';

  try {
    let data = await loadData(path = 'tasks');
    for (let key in data) {
      let title = data[key].title;
      let description = data[key].description;
      let dueDate = data[key].date;
      let prio = data[key].prio;
      let category = data[key].category;
      let subTasks = data[key].subtask;
      let taskStatus = data[key].status;



      if (taskStatus == "todo") {
        toDoField.innerHTML += generateTaskCard(key, title, description, dueDate, prio, category, subTasks,);
      }
      if (taskStatus == "progress") {
        inProgressField.innerHTML += generateTaskCard(key, title, description, dueDate, prio, category, subTasks,);
      }
      if (taskStatus == "feedback") {
        awaitFeedbackField.innerHTML += generateTaskCard(key, title, description, dueDate, prio, category, subTasks,);
      }
      if (taskStatus == "done") {
        doneField.innerHTML += generateTaskCard(key, title, description, dueDate, prio, category, subTasks,);
      }

    }
    ifTaskField([toDoField, inProgressField, awaitFeedbackField, doneField]);
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

function startDrag(id) {
  currentlyDragged = id;
}

async function moveTo(statusField) {
  await putData(statusField, `tasks/${currentlyDragged}/status`);
  initTasks();
}


function ifTaskField(sections) {
  for (let item in sections) {
     hideWindow(`task-field-${item}`, sections[item].innerHTML.trim() !== "");
  }

  // Überprüfe, ob die Felder leer sind
  // if (toDoField.innerHTML.trim() === "") {
  //   document.getElementById('task-field-0').classList.remove('d-none');
  // } else {
  //   document.getElementById('task-field-0').classList.add('d-none');
  // }

  // if (inProgressField.innerHTML.trim() === "") {
  //   document.getElementById('task-field-1').classList.remove('d-none');
  // } else {
  //   document.getElementById('task-field-1').classList.add('d-none');
  // }

  // if (awaitFeedbackField.innerHTML.trim() === "") {
  //   document.getElementById('task-field-2').classList.remove('d-none');
  // } else {
  //   document.getElementById('task-field-2').classList.add('d-none');
  // }

  // if (doneField.innerHTML.trim() === "") {
  //   document.getElementById('task-field-3').classList.remove('d-none');
  // } else {
  //   document.getElementById('task-field-3').classList.add('d-none');
  // }
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
  let screenWidth = window.innerWidth;

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


