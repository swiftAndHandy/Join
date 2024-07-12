/**
 * Creates and inserts HTML for a contact list item.
 * 
 * @param {number} index - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} color - The color associated with the contact.
 */
function createContactListHTML(index, name, email, color) {
    document.getElementById('contact-list').innerHTML += `
    <li id="contact-item-${index}" class="contact-item" onclick="openContactDetails('${index}')">
            <div class="contact-image--small" style="background-color:${color};">${showCapitaliseFirstLetters(name)}</div>
            <div class="contact-details">
                <p class="contact-name-list">${name}</p>
                <p class="contact-email-list">${email}</p>
            </div>
        </li>
    `;
}


/**
 * Creates and inserts HTML for a contact list letter header.
 * 
 * @param {string} letter - The letter to display as a header.
 */
function createContactLetterHTML(letter) {
    document.getElementById('contact-list').innerHTML += `
        <li class="letter">${letter}</li>
        <div class="underline"></div>
    `;
}


/**
 * Creates and inserts HTML for displaying the contact details.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} telefon - The phone number of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {number} i - The index of the contact.
 */
function contactDetailsHTML(name, email, telefon, color, i) {
    let contactInfoContainer = document.getElementById('contact-info-container');
    contactInfoContainer.style.display = 'block';
    contactInfoContainer.innerHTML = `
        <div class="image-name-container">
            <div class="contact-image--large" style="background-color:${color};">${showCapitaliseFirstLetters(name)}</div>
            <div class="name-buttons-container">
                <h2 class="contact-name--large">${limitLengthOf(name, 20)}</h2>
                <div class="edit-delete-buttons-container">
                    <div id="edit-button" class="edit-button" onclick="openEditContactPage('${i}')">
                        <img src="./assets/img/icons/edit.svg" alt="edit">edit
                    </div>
                    <div id="delete-button" class="delete-button" onclick="deleteContact('contacts/${i}', '${contactToEditId}')">
                        <img src="./assets/img/icons/delete.svg" alt="delete">delete
                    </div>
                </div>
            </div>
        </div>
        <span class="span-contact-info">Contact information</span>
        <div class="email-phone-container">
            <span class="span-email-phone">Email</span>
            <a id="current-contact-email" href="mailto:${email}" class="contact-email">${email}</a>
            <span class="span-email-phone">Phone</span>
            <a id="current-contact-phone" href="tel:${telefon}" class="tel-number">${telefon}</a>
        </div>
    `;
    document.getElementById('edit-button').style.display = 'flex';
    document.getElementById('delete-button').style.display = 'flex';
}

