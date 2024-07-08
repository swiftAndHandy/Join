function generateDropBoxContacts(entries,data) {
    let boxContent = document.getElementById('contacts-drop-menu-content');


      boxContent.innerHTML += `<div id="background-drop-menu-background${entries.path}" class="ul-content-wrapper ul-content-wrapper-no-click">
                    <div class="group-pb-cricle-with-name">
                    <span class="profile-initials-circle cursor-default " style="background-color: ${entries['color']};">${initials(entries.name)}</span>
                  <ul class="ul-row-styling cursor-default ">${entries.name}
                  </ul>
                  </div>
                  <input class="checkbox" id="contact-check${entries.path}" type="checkbox" value="${entries.path}" onchange="handleCheckBox(this,'${entries.path}')">
                  <label id="label-check${entries.path}" for="contact-check${entries.path}" form="form-desktop"></label>
                </div>`
    }
