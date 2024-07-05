function generateTaskCard( keyTasks, status, title, description, dueDate, prio, category, subTasks, contactEntries) {
  
  return`
  <article class="task-card-container" draggable="true" ondragstart="startDrag('${keyTasks}', '${status}')" id="taskId${keyTasks}">
    <div class="task-card-content">
      <div class="task-group-bubble">
        <span>${category}</span>
      </div>
      <div class="task-card-header mt-24">
        <h2>${title}</h2>
        <span class="task-sub-headline">${description} </span>
      </div>
      <div class="sub-task-container mt-24">
        <div class="sub-task-progress-bar">
           <div id="progress-length"></div>
        </div>
        <span>1/2 Subtasks</span>
      </div>
      <div class="assigned-user mt-24">
        <div class="profile-pictures">
          <div class="profile-cricle">${initials(contactEntries[0].name)}</div>
          <div class="profile-cricle">${initials(contactEntries[1].name)}</div>
          <div class="profile-cricle">${initials(contactEntries[2].name)}</div>
        </div>
        <div>
          <img id="prio-img${keyTasks}" src="./assets/img/icons/priority_medium.svg" alt="">
        </div>
      </div>
    </div>
  </article>`;
}