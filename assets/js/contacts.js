// Variables for storing the ID and color of the contact being edited
let contactToEditId = '';
let contactToEditColor = '';
let currentSelectedContactId = '';


 function initContacts() {
    includeHTML();
    putContactsToList() ;
    handleResize();
}

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
 * Executes the callback function if the window width is greater than or equal to the specified minWidth.
 * Also sets up an event listener to re-check the condition on window resize.
 * 
 * @param {number} minWidth - The minimum width of the window.
 * @param {function} callback - The function to execute when the condition is met.
 */
function executeOnMinWidth(minWidth, callback) {
    if (window.innerWidth >= minWidth) {
        callback();
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth >= minWidth) {
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
    document.getElementById('more-vert-button').style.display = 'none';

    changeContactItemColor(userId);
    contactDetailsHTML(name, email, telefon, color, userId);
    hideContactListForMobile();
}


/**
 * Manages the visibility of the contact list and contact details based on the window width.
 * If the window width is less than or equal to 820 pixels, it toggles the visibility of 
 * the contact list and contact details. Otherwise, it shows the contact list and hides the 
 * contact details if necessary.
 */
function hideContactListForMobile() {
    let contactInfoContainer = document.getElementById('contact-info-container').style.display;
    if (window.innerWidth <= 820) {
        if (contactInfoContainer === 'none' || contactInfoContainer === '') {
            document.getElementById('contact-list-container').style.display = 'block';
            document.getElementById('contact-window').style.display = 'none';
        } else {
            document.getElementById('contact-list-container').style.display = 'none';
            document.getElementById('contact-window').style.display = 'flex';
        }
        document.getElementById('contact-info-container').style.animation = 'unset';
        document.getElementById('more-vert-button').style.display = 'flex';
        document.getElementById('back-to-contacts-button').style.display = 'flex';
    } else { 
        if (contactInfoContainer === 'none') {
            document.getElementById('contact-list-container').style.display = 'block';
            document.getElementById('contact-window').style.display = 'none';
        }
    }
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
    let contactItem = document.getElementById(`contact-item-${userId}`);
    executeOnMaxWidth(820, async () => {
        contactItem.classList.remove('contact-item-selected');
        contactItem.classList.add('contact-item');
        return;
    });

    if (currentSelectedContactId !== null) {
        let previousContactItem = document.getElementById(`contact-item-${currentSelectedContactId}`);
        if (previousContactItem) {
            previousContactItem.classList.remove('contact-item-selected');
            previousContactItem.classList.add('contact-item');
        }

    }
    if (window.innerWidth > 820){
    contactItem.classList.add('contact-item-selected');
    contactItem.classList.remove('contact-item');
    };
    currentSelectedContactId = userId;
    


}


/**
 * Creates a new contact by sending the data to the server, updates the contact list,
 * and opens the details of the newly created contact if it matches the input data.
 * 
 * @param {Event} event - The form submit event.
 */
async function createContact(event) {
    event.preventDefault();
    let nameInput = document.getElementById('input-contact-name').value;
    let emailInput = document.getElementById('input-contact-email').value.toLowerCase();
    let phoneInput = document.getElementById('input-contact-phone').value;
    let nameToCompare = capitaliseFirstLetters(nameInput);

    await postData({
        'email': emailInput,
        'name': nameToCompare,
        'phone': phoneInput,
        'color': applyRandomColor()
    }, 'contacts');

    await putContactsToList();
    await openCreatedContact(nameToCompare, emailInput, phoneInput);
    closeContactModal();
    showCreatedContactModal();
}


/**
 * Searches for a contact that matches the provided name, email, and phone number,
 * and opens the contact details if a match is found.
 * 
 * @param {string} nameToCompare - The name to compare against the contacts.
 * @param {string} emailToCompare - The email to compare against the contacts.
 * @param {string} phoneToCompare - The phone number to compare against the contacts.
 */
async function openCreatedContact(nameToCompare, emailToCompare, phoneToCompare) {
    let contacts = await readData('contacts');
    for (let id in contacts) {
        let contact = contacts[id];
        if (contact.name === nameToCompare && contact.email === emailToCompare && contact.phone === phoneToCompare) {
            openContactDetails(id);
            break;
        }
    }
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
 * Deletes a contact from the server and triggers an update of the contact list.
 * 
 * @param {string} path - The path to the contact data.
 */
async function deleteContact(path = "", contactId) {
    await deleteData(path);
    const container = document.getElementById('contact-info-container');
    container.innerHTML = '';
    container.nextElementSibling.nextElementSibling.style = '';
    container.nextElementSibling.style = '';
    container.style = '';

    removeContactFromInterface(contactId);
    document.getElementById('modalBodyContent').innerHTML = '';
    mobileDeleteRules();
}


/**
 * Chances some styles to display the correct screen, when contacts is opened on a mobile device
 */
function mobileDeleteRules() {
    executeOnMaxWidth(820, async () => {
        document.getElementById('contact-list-container').style.display = 'block';
        document.getElementById('contact-window').style.display = 'none';
        document.getElementById('more-vert-button').style.display = 'none';
    });
}

/**
 * If the deleted contact is the last contact of a letter, the letter and the underline must 
 * be deleted. So this function uses the current contacts position on contact-list and checks 
 * the previous and next item. If the next one is another letter, and the previous one is an underline
 * it IS the last item. If there is no next sibling, simulate it has the value of 'letter' to prevent a crash.
 * So the previous to Element Siblings needs to be deleted.
 * The item itself needs to be deleted in each case.
 * @param {string} - the ID of the Contact that needs to be checked
 */
function removeContactFromInterface(contactId) {
    const item = document.getElementById(`contact-item-${contactId}`);
    let previousElement = item.previousElementSibling.classList.value;
    let nextElement = item.nextElementSibling ? item.nextElementSibling.classList.value : 'letter';

    if (previousElement == 'underline' && nextElement == 'letter') {
        item.previousElementSibling.remove();
        item.previousElementSibling.remove();
    }
    item.remove();
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