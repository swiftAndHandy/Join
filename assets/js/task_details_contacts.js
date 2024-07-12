
/**
 * Rendering Contact-List in Edit-Details. 
 * The Contact-List Contains contacts and accounts, so after fetching both
 * they recive a prefix that leads to there path on the server.
 * For every of those items HTML is generated.
 */
async function renderDetailsContactList() {
    let contacts = await readData('contacts');
    contacts = setPrefixToKey('contacts', contacts);
    let accounts = await readData('accounts');
    accounts = setPrefixToKey('accounts', accounts);

    let data = {};
    await Object.assign(data, accounts, contacts);
    let entries = sortByAlphabet(data);
    for (let i = 0; i < entries.length; i++) {
        generateContactsHtml(entries[i]);
    }
}

/**
 * Simulates an click on every assigned contact to activate it for contact list and submit array (assignedPersonsToUpdate)
 * CAVE: I try to enable user accounts also. in this case it needs to be set up to assign-contact-${item}, since contacts will be added by algorithm.
 */
async function activateAssignedContacts(assignedContacts) {
    if (assignedContacts) {
        for (let item of assignedContacts) {
            try {
                document.getElementById(`assign-contact-${item}`).click();
            } catch (error) {
                console.warn(`assign-contact-contacts/${item} couldn't be toggled`);
            }
        }
    }
}


/**
 * toggles the visibility of contact-list and contact-list input to show/hide the DOM-Content.
 * @param {string} id - used to get the correct id for design changes
 */
function openListSearch(id) {
    const btn = toggleVisibility(`${id}-task-contact-list-btn`);
    toggleVisibility(`${id}-task-contact-list-input`);
    toggleVisibility(`${id}-task-contacts-list`)
    const inputField = document.getElementById(`${id}-task-list-input-field`);
    const inputBox = inputField.parentElement.classList.add('focus');
    inputField.focus();
}


/**
 * Searchs for a contact based on a input.value and displays only contacts, who does match the search. 
 * @param {string} search - value of a text-input
 * example: <input type="text" oninput="searchContact(this.value)">;
 */
function searchContact(search) {
    const contactNames = Array.from(document.querySelectorAll('div.user-box span'));
    for (let item in contactNames) {
        hideWindow(contactNames[item].parentElement.parentElement.id,
            !contactNames[item].innerHTML.toLowerCase().includes(search.toLowerCase())
        );
    }
}

/**
 * Controls the design of checkboxes on the assigned-contacts-list
 * CAVE: id contains contacts/ (or theoretically accounts/). 
 * This is the optimum, so we can stop use pathes at readData and allow to assign users
 * For the moment, since it's not used trough the whole project, i'll filter and remove it.
 * @param {string} id 
 */
async function toggleThisContact(id) {
    const contactId = document.getElementById(`assign-contact-${id}`);
    const checkboxId = document.getElementById(`assign-contact-checkbox-${id}`);
    const pseudoCheckboxId = document.getElementById(`assign-contact-pseudo-checkbox-${id}`);
    await updateAssignedPersons(id);
    contactId.classList.toggle('list-selected');
    pseudoCheckboxId.classList.toggle('list-selected');
    checkboxId.checked = !checkboxId.checked;
}

/**
 * Renders the Contact-List in Edit-View.
 * @param {Object} data contains required information
 */
function generateContactsHtml(data) {
    const target = document.getElementById('edit-task-contacts-list');
    target.innerHTML += `
        <div id="assign-contact-${data.path}" class="single-contact" onclick="toggleThisContact('${data.path}')">
            <div class="user-box">
                <div id="edit-task-avatar-${data.id}" class="avatar at-drop-down" style="background-color: ${data['color']};">${initials(data.name)}</div>
                    <span id="edit-task-username-${data.id}">${data.name}</span>
                </div>
            <div id="assign-contact-pseudo-checkbox-${data.path}" class="pseudo-checkbox">
            </div>
                <input type="checkbox" class="contact-checkbox" id="assign-contact-checkbox-${data.path}" name="example-checkbox">
                <label for="assign-contact-checkbox-${data.path}"></label>
        </div>
        `;
}