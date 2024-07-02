function generateDropBoxContent() {
    let boxContent = document.getElementById('contacts-drop-menu-content');
    boxContent.innerHTML = ""
    for (let i = 0; i < 4; i++) {
   
      boxContent.innerHTML += `<div id="background-drop-menu-background${i}" class="ul-content-wrapper">
                    <span class="profile-initials-circle">AB</span>
                  <ul class="ul-row-styling">Alfred boo
                  </ul>
                  <input class="checkbox" id="contact-check${i}" type="checkbox" value="Alfred boo" onchange="handleCheckBox(this,${i})">
                  <label for="contact-check${i}" form="form-desktop"></label>
                </div>`
    }
};