const colors = [
    '#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'
];

/**
 * Initialising of index.html by starting animation on mobile-devices.
 */
function initIndex() {
    const startscreen = document.getElementById('startscreen');
    startscreen.classList.add('startscreen--animate');
    setTimeout(() => {
        startscreen.classList.add('over');
    }, 1000);
    includeHTML();
}

/**
 * Prevent event-bubbeling
 * @param {*} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
};

/**
 * check email for existance of an account. Try is used to prevent a crash on empty-databases.
 * @param {string} - The email address to check for an existing account.    
  * @returns {(Object|boolean)} - Returns the user entry object if the email exists, or false if the email does not exist or an error occurs.
 */
async function accountExists(email) {
    try {
        const output = await readUserdata('accounts');
        const outputArray = Object.entries(output);
        const userEntry = outputArray.find(entry => entry[1]['email'] === email);
        return userEntry;
    } catch (error) {
        return false;
    }
}

/**
 * responseToJason is containing every user. It's iterated by every userKeyArray-Index to  
 * compare Login-Form-Information with provided server-information.
 * If a match is found, forward to summary.html. ToDo: Add LocalStorage??? Incognito-Mode?!
 * @param {string} path 
 */
async function readUserdata(path) {
    const response = await fetch(BASE_URL + path + '.json');
    const responseToJason = await response.json();
    return responseToJason;

}