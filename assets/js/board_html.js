/**
 * Genereates HTML for the board..
 * The hidden description is used for search engine, since this one is not shortended by limitLengthOf().
 * Calls the async functions for the progressBar and the avatarCircles without await, so the result can be added later, 
 * while the next card is allready rendering.
 * @param {*} taskId - ID of the current task
 * @param {*} item - the Object that is fetched from taskId.
 * @param {HTMLElement} target - HTML Element that is adressed.
 * @param {*} [position='beforeend'] - position of insertAdjacentHTML. Only set for the rare case you might need and afterbegin or whatever.
 */

function generateTaskCard(taskId, item, target, position = 'beforeend') {
  target.insertAdjacentHTML(`${position}`, `
  <article class="task-card-container" onclick="openTaskDetails('${taskId}')" draggable="true" ondragstart="startDrag('${taskId}', '${item.status}')" id="taskId${taskId}">
    <div class="task-card-content">
      <div class="task-group-bubble ${item.tag.replace(/\s+/g, "-")}">
        <span>${item.tag}</span>
      </div>
      <div class="task-card-header mtb-24">
        <h2>${item.title}</h2>
        <span id="description-content${taskId}" class="task-sub-headline">${limitLengthOf(item.description, 80)}</span>
        <span id="hidden-description-content${taskId}" class="d-none">${item.description}</span>
      </div>
      <div class="sub-task-container">
        <div class="sub-task-progress-bar">
           <div class="progress-length " id="progress-length${taskId}"></div>
        </div>
        <span>1/2 Subtasks</span>
      </div>
      <div id="bottom-board-card-wrapper${taskId}" class="assigned-user mt-24">
        <div id="profile-circle-container-${taskId}" class="profile-pictures">
        </div>
      <div>
        <img id="prio-img${taskId}" alt="${item.priority}">
      </div>
    </div>
  </article>`);
  getSubtaskProgress(item.subtasks, taskId);
  generateCircleProfiles(item.assigned, taskId);
}

/**
 * contactEntries is iterated to read server-data. then, when server-data is fetched a new
 * avatar should be created for the user that's found. When 11 Accounts are have an Avatar, add an Placeholder for the 12+ Assigned Person.
 * @param {Object[]} contactEntries pathes to every contact and account that are assigned to the current taskId
 * @param {string} taskId - id of the task that should be rendered
 */
async function generateCircleProfiles(contactEntries, taskId) {
  const target = document.getElementById(`profile-circle-container-${taskId}`);
  if (contactEntries) {
    for (let contacts of contactEntries) {
      try {
        const user = await readData(`${contacts}`);
        target.insertAdjacentHTML('beforeend', `<div class="profile-cricle" id=profile-circle-container-${contacts}" style= "background-color:${user.color}">${initials(user.name)}</div>`);
        if (target.childElementCount >= 4) {
          target.insertAdjacentHTML('beforeend', `<div class="profile-cricle" id=profile-circle-container-max" style= "background-color:#29ABE2}">...</div>`);
          break;
        }
      } catch (error) { }
    }
  }
}