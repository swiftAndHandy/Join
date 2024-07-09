// Variables for storing the ID and color of the contact being edited
let contactToEditId = '';
let contactToEditColor = '';
let currentSelectedContactId = '';

/**
 * Executes the callback function if the window width is less than or equal to the specified maxWidth.
 * Also sets up an event listener to re-check the condition on window resize.
 * 
 * @param {number} maxWidth - The maximum width of the window.
 * @param {function} callback - The function to execute when the condition is met.
 */
function executeOnMaxWidth(maxWidth, callback) {
    if (window.innerWidth <= maxWidth) {
        callback();
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth <= maxWidth) {
            callback();
        }
    });
}


/**
 * Opens the 'Add Contact' page by fetching the HTML content and displaying the modal.
 */
async function openAddContactPage() {
    try {
        const response = await fetch('contact_dialog.html');
        const data = await response.text();
        document.getElementById('modalBodyContent').innerHTML = data;
        document.getElementById('addContactModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading the add contact form:', error);
    }
}


/**
 * Closes the 'Add Contact' page by hiding the modal.
 */
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
    contactToEditId = i;
    const contact = await readData(`contacts/${i}`);
    contactToEditColor = contact.color;
    try {
        const response = await fetch('contact_edit_dialog.html');
        const data = await response.text();
        document.getElementById('modalBodyContent').innerHTML = data;
        document.getElementById('addContactModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading the edit contact form:', error);
    }

    putContactInfoToEditDialog(contact.name, contact.email, contact.phone, contact.color);
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


/**
 * Retrieves and displays the list of contacts sorted by name.
 */
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
                <p class="contact-name">${name}</p>
                <p class="contact-email">${email}</p>
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
    `
}


/**
 * Returns the capitalized first letters of the words in the input string.
 * 
 * @param {string} input - The input string.
 * @returns {string} - The string with capitalized first letters.
 */
function showCapitaliseFirstLetters(input) {
    input = input.split(' ').map(word =>
        word.charAt(0).toUpperCase()).join('');
    return input.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}


/**
 * Opens the contact details page for the specified user ID by fetching the contact data
 * and displaying it in the contact details container. Hides the contact list container if 
 * the window width is less than or equal to 820 pixels.
 * 
 * @param {string} userId - The ID of the user to display details for.
 */
async function openContactDetails(userId) {
    let contact = await readData(`contacts/${userId}`);
    contactToEditId = userId;
    contactToEditColor = contact.color;
    let name = contact.name;
    let email = contact.email;
    let color = contact.color;
    let telefon = contact.phone;

    changeContactItemColor(userId);
    contactDetailsHTML(name, email, telefon, color, userId);
    executeOnMaxWidth(820, async () => {
        document.getElementById('contact-list-container').style.display = 'none';
        document.getElementById('contact-window').style.display = 'flex';
        document.getElementById('contact-info-container').style.animation = 'unset';
        document.getElementById('more-vert-button').style.display = 'flex';
    });
}


/**
 * Changes the color of the selected contact item.
 * 
 * Removes the "selected" class from the previously selected contact (if any),
 * adds it to the newly selected contact, and updates the global 
 * `currentSelectedContactId`.
 * 
 * @param {string} userId - The ID of the contact being selected.
 */
function changeContactItemColor(userId) {
    if (window.innerWidth <= 820) {
        return;
    }
    if (currentSelectedContactId !== null) {
        let previousContactItem = document.getElementById(`contact-item-${currentSelectedContactId}`);
        if (previousContactItem) {
            previousContactItem.classList.remove('contact-item-selected');
            previousContactItem.classList.add('contact-item');
        }
    }
        let contactItem = document.getElementById(`contact-item-${userId}`);
        contactItem.classList.add('contact-item-selected');
        contactItem.classList.remove('contact-item');

    currentSelectedContactId = userId;
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
                <h2 class="contact-name--large">${name}</h2>
                <div class="edit-delete-buttons-container">
                    <div id="edit-button" class="edit-button" onclick="openEditContactPage('${i}')">
                        <img src="./assets/img/icons/edit.svg" alt="edit">edit
                    </div>
                    <div id="delete-button" class="delete-button" onclick="deleteContact('/contacts/${i}')">
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
    closeContactModal();
}


/**
 * Edits an existing contact by sending the updated data to the server.
 * 
 * @param {string} contactId - The ID of the contact to edit.
 * @param {Event} event - The form submit event.
 */
async function editContact(event) {
    event.preventDefault();
    let nameInput = document.getElementById('name-input').value;
    let emailInput = document.getElementById('email-input').value.toLowerCase();
    let phoneInput = document.getElementById('phone-input').value;

    await putData({
        'color': contactToEditColor,
        'email': emailInput,
        'name': nameInput,
        'phone': phoneInput,
    }, `contacts/${contactToEditId}`);
    await putContactsToList();
    openContactDetails(contactToEditId);
    closeContactModal();
}


/**
 * Closes the contact modal with an animation.
 */
function closeContactModal() {
    let modal = document.getElementById('addContactModal');
    modal.style.animation = 'close-modal-animation';
    modal.style.animationTimingFunction = 'ease-in';
    modal.style.animationDuration = '301ms';

    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animationName = '';
        modal.style.animationTimingFunction = '';
        modal.style.animationDuration = '';
    }, 300);
}


/**
 * Deletes a contact from the server and updates the contact list.
 * 
 * @param {string} path - The path to the contact data.
 */
async function deleteContact(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    await putContactsToList();
    document.getElementById('contact-info-container').style.display = 'none';

    executeOnMaxWidth(820, async () => {
        document.getElementById('contact-list-container').style.display = 'block';
        document.getElementById('contact-window').style.display = 'none';
        document.getElementById('more-vert-button').style.display = 'none';
    });
    return await response.json();
}

/**
 * Closes the contact window and displays the contact list container.
 */
function closeContactWindow() {
    document.getElementById('contact-window').style.display = 'none';
    document.getElementById('contact-list-container').style.display = 'block';
}


/**
 * Opens the contact options by displaying the options and hiding the "more-vert" button.
 */
function openContactOptions() {
    document.getElementById('more-vert-button').style.display = 'none';
    document.getElementById('contact-options').style.display = 'block';
    document.getElementById('contact-options').style.animationName = 'contact-options-animation';
}


/**
 * Closes the contact options with an animation and displays the "more-vert" button.
 */
function closeContactOptions() {
    document.getElementById('more-vert-button').style.display = 'block';
    document.getElementById('contact-options').style.animationName = 'contact-options-animation-close';
    setTimeout(() => {
        document.getElementById('contact-options').style.display = 'none';
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('click', (event) => {
        if (!event.target.closest('#contact-options') && !event.target.closest('#more-vert-button')) {
            closeContactOptions();
        }
    });
});