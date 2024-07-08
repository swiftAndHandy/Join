function generateTaskCard(keyTasks, item) {
  
  return `
  <article class="task-card-container" ondblclick="openTaskDetails('${keyTasks}')" draggable="true" ondragstart="startDrag('${keyTasks}', '${item.status}')" id="taskId${keyTasks}">
    <div class="task-card-content">
      <div class="task-group-bubble ${item.tag.replace(/\s+/g, "-")}">
        <span>${item.tag}</span>
      </div>
      <div class="task-card-header mt-24">
        <h2>${item.title}</h2>
        <span id="description-content${keyTasks}" class="task-sub-headline">${trimToSixtyCharacters(item.description)} </span>
      </div>
      <div class="sub-task-container mt-24">
        <div class="sub-task-progress-bar">
           <div id="progress-length${keyTasks}"></div>
        </div>
        <span>1/2 Subtasks</span>
      </div>
      <div class="assigned-user mt-24">
        <div id="profile-circle-container-${keyTasks}" class="profile-pictures">
        </div>
        <div>
          <img id="prio-img${keyTasks}" src="./assets/img/icons/priority_medium.svg" alt="">
        </div>
      </div>
    </div>
  </article>`;
}

async function generateCircleProfiles(contactEntries, taskId, data) {
  let output = '';
  if (contactEntries) {
    for (let contacts of contactEntries) {
      const user = await readData(`contacts/${contacts}`);
      try {
        output += `
      <div class="profile-cricle" id=profile-circle-container-${contacts}" style= "background-color:${user.color}">${initials(user.name)}</div>
      `;
      } catch (error) {
        // console.warn(`'${data[taskId].title}' (ID: ${taskId}), is assigned to Contact-ID ${contacts}. That assigned contact doesn't exist anymore!`);
      }
    }
  }
  return output;
}