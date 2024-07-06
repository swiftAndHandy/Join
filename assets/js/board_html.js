function generateTaskCard( keyTasks, status, title, description, dueDate, prio, tag, subTasks, contactEntries,assigned) {
  

  
  return`
  <article class="task-card-container" draggable="true" ondragstart="startDrag('${keyTasks}', '${status}')" id="taskId${keyTasks}">
    <div class="task-card-content">
      <div class="task-group-bubble ${tag.replace(/\s+/g, "-")}">
        <span>${tag}</span>
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
        <div id="profile-circle-container" class="profile-pictures">
          <div class="profile-cricle" id=profile-circle-container0 style= "background-color:${contactEntries[0].color}">${assigned[0]}</div>
          <div class="profile-cricle" id=profile-circle-container1 style= "background-color:${contactEntries[1].color}">${assigned[0]}</div>
          <div class="profile-cricle" id=profile-circle-container2 style= "background-color:${contactEntries[2].color}">${assigned[0]}</div>
        </div>
        <div>
          <img id="prio-img${keyTasks}" src="./assets/img/icons/priority_medium.svg" alt="">
        </div>
      </div>
    </div>
  </article>`;
}

// function addProfileCircles(keyTasks, status, title, description, date, prio, tag, subTasks, assigned, contactEntries) {
//   let target = document.getElementById('profile-circle-container')

//   // Iteriere über die zugewiesenen Kontakte und füge die Profilkreise hinzu
//   for (let i = 0; i < assigned.length && i < 3; i++) {
//     target.insertAdjacentHTML('beforeend', `
//       <div class="profile-circle" id="profile-circle-container${i}" style="background-color:${contactEntries[i].color}">
//         ${assigned[i]}
//       </div>
//     `);
//   }
// }