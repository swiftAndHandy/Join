async function loadData(path='tasks') {
  let response = await fetch(base_URL + path + '.json');
  let responseToJson = await response.json();
  console.log(responseToJson);
  return responseToJson;
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
      let data = await loadData(path='tasks');
      for(let key in data) {
          const title = data[key].title;
          const description = data[key].description;
          const dueDate = data[key].date;
          const prio = data[key].prio;
          const category = data[key].category;
          const subTasks = data[key].subtask;
          const taskStatus = data[key].status

       
          if(taskStatus == "toDo") {
           
          toDoField.innerHTML += generateTaskCard(key,title,description,dueDate,prio,category,subTasks);
        }
        if(taskStatus == "inProgress") {
          inProgressField.innerHTML += generateTaskCard(key,title,description,dueDate,prio,category,subTasks);
        }
        if(taskStatus == "awaitFeedback") {
          awaitFeedbackField.innerHTML += generateTaskCard(key,title,description,dueDate,prio,category,subTasks);
        }
        if(taskStatus == "done") {
          doneField.innerHTML += generateTaskCard(key,title,description,dueDate,prio,category,subTasks);
        }
        
      }
      ifTaskField(toDoField,inProgressField,awaitFeedbackField,doneField);
  } catch (error) {
      console.error(error);
  }
}

function ifTaskField(toDoField, inProgressField, awaitFeedbackField, doneField) {
  // Überprüfe, ob die Felder leer sind
  if (toDoField.innerHTML.trim() === "") {
      document.getElementById('task-field-1').classList.remove('d-none');
  } else {
      document.getElementById('task-field-1').classList.add('d-none');
  }

  if (inProgressField.innerHTML.trim() === "") {
      document.getElementById('task-field-2').classList.remove('d-none');
  } else {
      document.getElementById('task-field-2').classList.add('d-none');
  }

  if (awaitFeedbackField.innerHTML.trim() === "") {
      document.getElementById('task-field-3').classList.remove('d-none');
  } else {
      document.getElementById('task-field-3').classList.add('d-none');
  }

  if (doneField.innerHTML.trim() === "") {
      document.getElementById('task-field-4').classList.remove('d-none');
  } else {
      document.getElementById('task-field-4').classList.add('d-none');
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

document.addEventListener("DOMContentLoaded", function () {
  // Deine Funktion, die beim Laden der Seite aufgerufen wird
  addOpenAddTaskToButtons(); // Füge onclick zu den Buttons hinzu
});


