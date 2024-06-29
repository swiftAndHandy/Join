function addOpenAddTaskToButtons() {
  const buttons = document.querySelectorAll(
    "button.add-cross-btn-small, button.add-task-btn"
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
  document.body.classList.add('overflow-all-hidden');
}

function switchToAddTask() {
    let addTaskUrl = "../add_task.html";
    window.location.href = addTaskUrl;
}

function closeAddTaskPopUp() {
  let popUpTranstion = document.getElementById("add-task-transition");
  popUpTranstion.classList.remove("transition-right");
  document.body.classList.remove('overflow-all-hidden');
}

document.addEventListener("DOMContentLoaded", function () {
  // Deine Funktion, die beim Laden der Seite aufgerufen wird
  addOpenAddTaskToButtons(); // Füge onclick zu den Buttons hinzu
});
