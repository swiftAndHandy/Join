function generateDropBoxContacts(data) {
    let boxContent = document.getElementById('contacts-drop-menu-content');


      boxContent.innerHTML += `<div id="background-drop-menu-background${data.path}" class="ul-content-wrapper ul-content-wrapper-no-click">
                    <div class="group-pb-cricle-with-name">
                    <span class="profile-initials-circle cursor-default " style="background-color: ${data['color']};">${initials(data.name)}</span>
                  <ul class="ul-row-styling cursor-default ">${data.name}
                  </ul>
                  </div>
                  <input class="checkbox" id="contact-check${data.path}" type="checkbox" value="${data.name}" onchange="handleCheckBox(this,'${data.path}')">
                  <label id="label-check${data.path}" for="contact-check${data.path}" form="form-desktop"></label>
                </div>`
    }
