function generateDropBoxContacts(entries, data) {
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
