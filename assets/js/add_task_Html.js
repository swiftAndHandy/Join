function generateDropBoxContent() {
    let boxContent = document.getElementById('contacts-drop-menu-content');
    boxContent.innerHTML = ""
    for (let i = 0; i < 4; i++) {
   
      boxContent.innerHTML += `<div id="background-drop-menu-background${i}" class="ul-content-wrapper">
                    <div class="group-pb-cricle-with-name">
                    <span class="profile-initials-circle">AB</span>
                  <ul class="ul-row-styling">${addTaskAssignedContacts[i]}
                  </ul>
                  </div>
                  <input class="checkbox" id="contact-check${i}" type="checkbox" value="${addTaskAssignedContacts[i]}" onchange="handleCheckBox(this,${i})">
                  <label for="contact-check${i}" form="form-desktop"></label>
                </div>`
    }
};