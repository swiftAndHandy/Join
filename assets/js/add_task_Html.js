/**
 * Generates contact elements in the dropdown menu. Data is fetched from the Firebase backend.
 * 
 * @param {Object} entries - The contact entries fetched from the backend.
 * @param {string} entries.path - The unique path or ID of the contact.
 * @param {string} entries.color - The color associated with the contact.
 * @param {string} entries.name - The name of the contact.
 */
function generateDropBoxContacts(entries) {
  let boxContent = document.getElementById('contacts-drop-menu-content');

  boxContent.innerHTML += `
    <div id="background-drop-menu-background${entries.path}"
      onclick="document.getElementById('contact-check${entries.path}').click()"
      class="ul-content-wrapper ul-content-wrapper-no-click">
      <div class="group-pb-cricle-with-name">
        <span class="profile-initials-circle"
          style="background-color: ${entries['color']};">${initials(entries.name)}</span>
        <ul class="ul-row-styling">${entries.name}
        </ul>
      </div>
      <input class="checkbox" id="contact-check${entries.path}" type="checkbox" value="${entries.path}"
        onchange="handleCheckBox(this,'${entries.path}')">
      <label id="label-check${entries.path}" for="contact-check${entries.path}" onclick="stopPropagation(event)"></label>
    </div>
    `;
}

/**
 * generates avatar-circles, when a user is added trough contacts-assignment.
 * removes avatar-circles, when a user is removed and this user is not in overflow.
 * if overflow exists, count it.
 * @param {string} path - a path that leads to the user-information on firebase
 */
async function generateCircleProfilesLine(path) {
  const userAvatar = document.getElementById(`profile-cicle-${path}`);
  const target = document.getElementById(`contacts-img-line`);

  if (!addTaskAssignedContacts.includes(path)) {
    addUserAvatar(path, target);
  } else {
    removeUserAvatar(userAvatar, target, path);
  }
}


/**
 * Creates new Avatars or counts up the overflow-avatar, after creating it.
 * @param {string} pathToUser - path to user-information on server
 * @param {HTMLElement} target - Element where the Avatar should become placed
 */
async function addUserAvatar(pathToUser, target) {
  if (document.getElementById('profile-cicle-max')) {
    addTaskAssignedOverflow.push(pathToUser);
    document.getElementById('profile-cicle-max').innerHTML = `+${addTaskAssignedOverflow.length}`; //- shown Avatars
  } else if (addTaskAssignedContacts.length == 4) {
    addTaskAssignedOverflow.push(pathToUser);
    target.insertAdjacentHTML('beforeend', `<div class="profile-initials-circle-line" id="profile-cicle-max" style="background-color:#29ABE2">+${addTaskAssignedOverflow.length}</div>`);
  } else {
    const user = await readData(`${pathToUser}`);
    target.insertAdjacentHTML('afterbegin', `<div class="profile-initials-circle-line" id="profile-cicle-${pathToUser}" style="background-color:${user.color}">${initials(user.name)}</div>`);
  }
}


/**
 * Triggers the remove existing Avatars or the count down the overflow-avatar, after creating it.
 * @param {string} pathToUser - path to user-information on server
 * @param {HTMLElement} target - Element where the Avatar should become placed
 */
function removeUserAvatar(userAvatar, target, path) {
  if (userAvatar) {
    removeExistingUserAvatar(userAvatar, target);
  } else {
    removeOverflowUser(path);
  }
}


/**
 * Remove existing Avatars
 * @param {string} pathToUser - path to user-information on server
 * @param {HTMLElement} target - Element where the Avatar should become placed
 */
async function removeExistingUserAvatar(userAvatar, target) {
  userAvatar.remove();
    if (addTaskAssignedOverflow.length){
      const user = await readData(`${addTaskAssignedOverflow[0]}`);
      target.insertAdjacentHTML('afterbegin', `<div class="profile-initials-circle-line" id="profile-cicle-${addTaskAssignedOverflow[0]}" style="background-color:${user.color}">${initials(user.name)}</div>`);
      addTaskAssignedOverflow.splice(0, 1);
    };
    if (addTaskAssignedOverflow.length){
      document.getElementById('profile-cicle-max').innerHTML = `+${addTaskAssignedOverflow.length}`;
    } else if (document.getElementById('profile-cicle-max')) {
      document.getElementById('profile-cicle-max').remove();
    }
}


/**
 * Reduces or deletes overflow
 */
function removeOverflowUser(user){
  const position = addTaskAssignedOverflow.indexOf(user);
  addTaskAssignedOverflow.splice(position, 1);
    if (addTaskAssignedOverflow.length) {
      document.getElementById('profile-cicle-max').innerHTML = `+${addTaskAssignedOverflow.length}`;
    } else {
      document.getElementById('profile-cicle-max').remove();
    }
}