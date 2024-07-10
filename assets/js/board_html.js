function generateTaskCard(taskId, item, target) {
  target.insertAdjacentHTML('beforeend', `
  <article class="task-card-container" onclick="openTaskDetails('${taskId}')" draggable="true" ondragstart="startDrag('${taskId}', '${item.status}')" id="taskId${taskId}">
    <div class="task-card-content">
      <div class="task-group-bubble ${item.tag.replace(/\s+/g, "-")}">
        <span>${item.tag}</span>
      </div>
      <div class="task-card-header mt-24">
        <h2>${item.title}</h2>
        <span id="description-content${taskId}" class="task-sub-headline">${limitLengthOf(item.description, 80)} </span>
      </div>
      <div class="sub-task-container mt-24">
        <div class="sub-task-progress-bar">
           <div class="progress-length " id="progress-length${taskId}"></div>
        </div>
        <span>1/2 Subtasks</span>
      </div>
      <div class="assigned-user mt-24">
        <div id="profile-circle-container-${taskId}" class="profile-pictures">
        </div>
        <div>
          <img id="prio-img${taskId}" alt="${item.priority}">
        </div>
      </div>
    </div>
  </article>`);
  getSubtaskProgress(item.subtasks, taskId);
  generateCircleProfiles(item.assigned, taskId);
}

async function generateCircleProfiles(contactEntries, taskId) {
  const target = document.getElementById(`profile-circle-container-${taskId}`);
  if (contactEntries) {
    for (let contacts of contactEntries) {
      try {
        const user = await readData(`${contacts}`);
        target.insertAdjacentHTML('beforeend', `<div class="profile-cricle" id=profile-circle-container-${contacts}" style= "background-color:${user.color}">${initials(user.name)}</div>`);
        if (target.childElementCount >= 11) {
          target.insertAdjacentHTML('beforeend', `<div class="profile-cricle" id=profile-circle-container-${contacts}" style= "background-color:#29ABE2}">...</div>`);
          break;
        }
      } catch (error) { }
    }
  }
}

async function getSubtaskProgress(subtasks, taskId) {
  let doneSubtasks = 0; let totalSubtasks = 0;

  if (subtasks) {
    subtasks.forEach(element => {
      totalSubtasks++;
      element.done && doneSubtasks++;
    });
  }

  calculateSubtaskProgressOf(taskId, doneSubtasks, totalSubtasks);
}

async function calculateSubtaskProgressOf(taskId, done, total) {
  const target = document.getElementById(`progress-length${taskId}`);
  let progress = Number(done*100/total).toFixed(0);
  if (!isNaN(progress)) {
    target.style.width = `${progress}%`;
    target.parentElement.nextElementSibling.innerHTML = `${done}/${total} Subtasks`;
  } else {
    target.parentElement.classList.add('d-none');
    target.parentElement.nextElementSibling.classList.add('d-none');
  }
}