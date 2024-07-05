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


async function putContactsToList() {
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

    contactDetailsHTML(name, email, telefon, color);
}


function contactDetailsHTML(name, email, telefon, color) {
    let contactInfoContainer = document.getElementById('contact-info-container');
    contactInfoContainer.style.display = 'block';
    contactInfoContainer.innerHTML = `
    <div class="image-name-container">
                    <div class="contact-image--large" style="background-color:${color};">${showCapitaliseFirstLetters(name)}</div>
                    <div class="name-buttons-container">
                        <h2 class="contact-name--large">${name}</h2>
                        <div class="edit-delete-buttons-container">
                            <div class="edit-button"><img src="./assets/img/icons/edit.svg" alt="edit">edit</div>
                            <div class="delete-button"><img src="./assets/img/icons/delete.svg" alt="delete">delete
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
    `
}