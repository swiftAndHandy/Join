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
 * Generates profile pictures with the right initials for the contact box.
 * Fetches user data and creates profile circles with initials for each assigned contact.
 * If there are more than 10 contacts, the function will add a circle with "..." to indicate more contacts.
 */
async function generateCircleProfilesLine() {
  const target = document.getElementById(`contacts-img-line`);
  if (target) {
    target.innerHTML = '';
    for (let contact of addTaskAssignedContacts) {
        const user = await readData(`${contact}`);
        target.insertAdjacentHTML('beforeend', `<div class="profile-initials-circle-line" id="profile-cicle-${contact}" style="background-color:${user.color}">${initials(user.name)}</div>`);
        if (target.childElementCount >= 11) {
          target.insertAdjacentHTML('beforeend', `<div class="profile-initials-circle-line" id="profile-circle-container-${contact}" style="background-color:#29ABE2">...</div>`);
          break;
        }
    }
  }
}
