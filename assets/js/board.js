async function loadData(path='tasks') {
  let response = await fetch(base_URL + path + '.json');
  let responseToJson = await response.json();
  console.log(responseToJson);
  return responseToJson;
}

async function initTasks() {
  let addedTask = document.getElementById('added-tasks');
  addedTask.innerHTML = '';
  try {
      let data = await loadData();
      for(let key in data) {
          const title = data[key].title;
          const description = data[key].description;
          const dueDate = data[key].date;
          const prio = data[key].prio;
          const category = data[key].category;
          const subTasks = data[key].subtask;

          addedTask.innerHTML += `<div id="${key}" class="card-one"><div>${title}</div><div>${description}</div>
          <div>${dueDate}</div><div>${prio}</div><div>${category}</div>
          <div>${subTasks}</div></div>`;
      }
  } catch (error) {
      console.error(error);
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


