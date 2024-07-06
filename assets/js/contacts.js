function openAddContactPage() {
    fetch('contact_dialog.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('modalBodyContent').innerHTML = data;
            document.getElementById('addContactModal').style.display = 'block';
        })
        .catch(error => console.error('Error loading the add contact form:', error));
}


function closeAddContactPage() {
    document.getElementById('addContactModal').style.display = 'none';
}

/**
 * Opens the 'Edit Contact' page for the contact at the given index by fetching the HTML content 
 * and displaying the modal with the contact's information filled in.
 * 
 * @param {number} i - The index of the contact to be edited.
 */
async function openEditContactPage(i) {

    let contact = await readData(`contacts/${i}`); 
    let name = contact.name;
    let email = contact.email;
    let color = contact.color;
    let telefon = contact.phone;

    await fetch('contact_edit_dialog.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('modalBodyContent').innerHTML = data;
        })
        .catch(error => console.error('Error loading the edit contact form:', error));

    putContactInfoToEditDialog(name, email, telefon, color);
}


/**
 * Fills the 'Edit Contact' form with the provided contact information.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} telefon - The phone number of the contact.
 * @param {string} color - The color associated with the contact.
 */
function putContactInfoToEditDialog(name, email, telefon, color) {
    document.getElementById('profile-img').style.backgroundColor = color;
    document.getElementById('first-letters').innerHTML = showCapitaliseFirstLetters(name);
    document.getElementById('name-input').value = name;
    document.getElementById('email-input').value = email;
    document.getElementById('phone-input').value = telefon;
}


async function putContactsToList() {
    document.getElementById('contact-list').innerHTML = '';
    let contacts = await readData('contacts');
    contacts = sortByAlphabet(contacts, 'contacts');
    let currentLetter = '';

    for (let i = 0; i < contacts.length; i++) {
        const id = contacts[i].id;
        const name = contacts[i].name;
        const email = contacts[i].email;
        const color = contacts[i].color;
        const firstLetter = name.charAt(0);


        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            createContactLetterHTML(currentLetter);
        }
        createContactListHTML(id, name, email, color);
    }
}


function createContactListHTML(index, name, email, color) {
    document.getElementById('contact-list').innerHTML += `
    <li id="contact-item-${index}" class="contact-item" onclick="openContactDetails('${index}')">
            <div class="contact-image--small" style="background-color:${color};">${showCapitaliseFirstLetters(name)}</div>
            <div class="contact-details">
                <p class="contact-name">${name}</p>
                <p class="contact-email">${email}</p>
            </div>
        </li>
    `;
}


function createContactLetterHTML(letter) {
    document.getElementById('contact-list').innerHTML += `
    <li class="letter">${letter}</li>
    <div class="underline"></div>
    `
}


function showCapitaliseFirstLetters(input) {
    input = input.split(' ').map(word =>
        word.charAt(0).toUpperCase()).join('');
    return input.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}


async function openContactDetails(userId) {
    let contact = await readData(`contacts/${userId}`);
    let name = contact.name;
    let email = contact.email;
    let color = contact.color;
    let telefon = contact.phone;

    contactDetailsHTML(name, email, telefon, color,userId);
}


function contactDetailsHTML(name, email, telefon, color, i) {
    let contactInfoContainer = document.getElementById('contact-info-container');
    contactInfoContainer.style.display = 'block';
    contactInfoContainer.innerHTML = `
        <div class="image-name-container">
            <div class="contact-image--large" style="background-color:${color};">${showCapitaliseFirstLetters(name)}</div>
            <div class="name-buttons-container">
                <h2 class="contact-name--large">${name}</h2>
                <div class="edit-delete-buttons-container">
                    <div id="edit-button" class="edit-button" onclick="openEditContactPage('${i}')">
                        <img src="./assets/img/icons/edit.svg" alt="edit">edit
                    </div>
                    <div id="delete-button" class="delete-button">
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

/**
 * Creates a new contact by sending the data to the server and updates the contact list.
 * 
 * @param {Event} event - The form submit event.
 */
async function createContact(event) {
    event.preventDefault();
    let nameInput = document.getElementById('input-contact-name').value;
    let emailInput = document.getElementById('input-contact-email').value.toLowerCase();
    let phoneInput = document.getElementById('input-contact-phone').value;

    await postData({
        'email': emailInput,
        'name': nameInput,
        'phone': phoneInput,
        'color': applyRandomColor()
    }, 'contacts');
    await putContactsToList();
    closeAddContactPage();
}


/**
 * Edits an existing contact by sending the updated data to the server.
 * 
 * @param {string} contactId - The ID of the contact to edit.
 * @param {Event} event - The form submit event.
 */
async function editContact(contactId, event) {
    event.preventDefault();
    let nameInput = document.getElementById('name-input').value;
    let emailInput = document.getElementById('email-input').value.toLowerCase();
    let phoneInput = document.getElementById('phone-input').value;

    await putData({
        'email': emailInput,
        'name': nameInput,
        'phone': phoneInput,
    }, `contacts/${contactId}`);
}