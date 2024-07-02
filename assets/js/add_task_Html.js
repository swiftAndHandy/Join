function generateDropBoxContent() {
    let boxContent = document.getElementById('contacts-drop-menu-content');
    boxContent.innerHTML = ""
    for (let i = 0; i < 4; i++) {
   
      boxContent.innerHTML += `<div id="background-drop-menu-background${i}" class="ul-content-wrapper ul-content-wrapper-no-click">
                    <div class="group-pb-cricle-with-name">
                    <span class="profile-initials-circle cursor-default">AB</span>
                  <ul class="ul-row-styling cursor-default ">${selectedContacts[i]}
                  </ul>
                  </div>
                  <input class="checkbox" id="contact-check${i}" type="checkbox" value="${selectedContacts[i]}" onchange="handleCheckBox(this,${i})">
                  <label id="label-check${i}" for="contact-check${i}" form="form-desktop"></label>
                </div>`
    }
};