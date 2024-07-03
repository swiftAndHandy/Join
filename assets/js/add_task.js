let addTaskTitle = "";
let addTaskDescription = "";
let addTaskAssignedContacts = [];
let selectedContacts = ['Hans bauer', 'Fred schauer', 'baumgarten Wow', 'Marcel Auer'];
let addTaskDueDate = "";
let addTaskPrio = "";
let addTaskCategory = "";
let addTaskSubtask = "";
let taskStatus = "done";
let pressedButton = 0;
let alreadyOpen = false;

const base_URL =
  "https://join-256-default-rtdb.europe-west1.firebasedatabase.app/";//#endregion


  function init() {
    includeHTML();
    generateDropBoxContent();
  }

async function postData(
  path = "tasks",
  data = {}
) {
  try {
    let response = await fetch(base_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());//
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
}

function addTitle() {
  let title = document.getElementById("task-title");
  addTaskTitle = title.value;
  title.value = "";
}

function addDescription() {
  let taskDescription = document.getElementById("task-description");
  addTaskDescription = taskDescription.value;
  taskDescription.value = "";
}

// function assignedContact() {
//   let assignedToContact = document.getElementById("assigned-to-contact");
//   addTaskAssignedContacts = addTaskAssignedContacts
//   assignedToContact.value = "";
// } maybe no use for it anymore
/**
 * 
 * @returns {void}
 * @param {HTMLInputElement} checkbox Contains the value of the checked element from the form tag with the id="form-desktop"
 * @param {number} idNumber Uses a number from a for-loop to assign individual IDs.
 */
function handleCheckBox(checkbox, idNumber) {
    // check if checkbox is clicked
    if (checkbox.checked) {
       // when checkbox is clicked and value is not in array then if statment
        if (!addTaskAssignedContacts.includes(checkbox.value)) {
            addTaskAssignedContacts.push(checkbox.value);
          
        }

        console.log("Checkbox mit Wert " + checkbox.value + " ist aktiviert.");
        pressedCheckBoxStyle(idNumber);
    } else {
    
        const valueIndex = addTaskAssignedContacts.indexOf(checkbox.value);
        if (valueIndex > -1) {
            addTaskAssignedContacts.splice(valueIndex, 1);
        }

        console.log("Checkbox mit Wert " + checkbox.value + " ist deaktiviert.");
        unPressedCheckBoxStyle(idNumber);
    }
    console.log('Aktuelle ausgewählte Kontakte: ', addTaskAssignedContacts);
}

  function pressedCheckBoxStyle (idNumber) {  
    document.getElementById(`label-check${idNumber}`).classList.add('filter-to-white')
        document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('ul-content-wrapper-no-click')
        document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('pressed-drop-box-bg-color');

}

  function unPressedCheckBoxStyle(idNumber) {
  document.getElementById(`label-check${idNumber}`).classList.remove('filter-to-white')
        document.getElementById(`background-drop-menu-background${idNumber}`).classList.add('ul-content-wrapper-no-click')
        document.getElementById(`background-drop-menu-background${idNumber}`).classList.remove('pressed-drop-box-bg-color');
        
  }

function toggleContactDropBox() {
   
   if(!alreadyOpen) {
    document.getElementById('contacts-drop-menu').classList.remove('d-none');
    document.getElementById('required-text-span').classList.add('d-none');
    document.getElementById('contact-input-wrapper').classList.add('d-none');
    document.getElementById('contacts-show-input').classList.remove('d-none');
    document.getElementById('contacts-show-input').classList.add('border-color-clicked');
    alreadyOpen = true
   }else {
    document.getElementById('contacts-drop-menu').classList.add('d-none');
    document.getElementById('required-text-span').classList.remove('d-none');
    document.getElementById('contact-input-wrapper').classList.remove('d-none');
    document.getElementById('contacts-show-input').classList.add('d-none');
   
    
    alreadyOpen= false 
   }
}

function taskDueDate() {
  let dueDate = document.getElementById("task-due-date");
  let date = new Date(dueDate.value);
  let dateOption = { month: "long", day: "numeric", year: "numeric" };
  let formattedDate = date.toLocaleDateString("en-US", dateOption);
  addTaskDueDate = formattedDate;
  dueDate.value = "";
}

function taskCategory() {
  let category = document.getElementById("select-task-category");
  addTaskCategory = category.value;
  category.value = "";
}

function taskSubtask() {
  let subtask = document.getElementById("task-subtask");
  addTaskSubtask = subtask.value;
  subtask.value = "";
}

function addnewTask() {
  addTitle();
  addDescription();
//   assignedContact(); maybe not needed anymore
  taskDueDate();
  taskCategory();
  taskSubtask();
  postData(
    (path = "accounts"),
    (data = {
      title: addTaskTitle,
      description: addTaskDescription,
      contact: addTaskAssignedContacts,
      date: addTaskDueDate,
      prio: addTaskPrio,
      category: addTaskCategory,
      subtask: addTaskSubtask,
      status: taskStatus,
    })
  );
  window.location.href = 'board.html';
}

function checkIfFormFilled() {
  const form = document.getElementById("add-task-form");
  const requiredFields = form.querySelectorAll("[required]");
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
    }
  });
  if (allFilled) {
    addnewTask();
  } else {
    console.log(
      "Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie absenden."
    );
  }
}

function setPrio(prio, number) {
  const priorities = ["urgent", "medium", "low"];
  const colors = ["orange", "yellow", "green"];
  let pressedButton;

  // Setze die aktuelle Priorität und die Nummer des gedrückten Buttons
  addTaskPrio = prio;
  pressedButton = number;

  // Entferne die Klassen von allen Prio-Buttons
  priorities.forEach((priority, index) => {
    const prioElement = document.getElementById(`${priority}-prio`);
    const prioImgElement = document.getElementById(`${priority}-prio-img`);

    prioElement.classList.remove(`pressed-color-${colors[index]}`);
    prioImgElement.classList.remove("pressed-prio-img");
  });

  if (pressedButton > 0 && pressedButton <= priorities.length) {
    const currentPriority = priorities[pressedButton - 1];
    const currentColor = colors[pressedButton - 1];

    document
      .getElementById(`${currentPriority}-prio`)
      .classList.add(`pressed-color-${currentColor}`);
    document
      .getElementById(`${currentPriority}-prio-img`)
      .classList.add("pressed-prio-img");
  }
}
