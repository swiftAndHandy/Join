const colors = [
    '#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'
];

/**
 * Stores a key-value pair in the local storage.
 * The value is converted to a JSON string before storing.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {*} value - The value to be stored. It will be serialized to a JSON string.
 */
function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

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



async function putData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/**
 * Checks if a user account with the given email address and optional password exists.
 * @param {string} email - The email address to check for an existing account.
 * @param {string} [password=false] - The password to check for. If no password is provided, only the email is checked.
 * @returns {(Object|boolean)} - Returns the user object if an account with the given email (and optional password) exists,
 *                               or false if no account is found or an error occurs.
 */
async function accountExists(email, password = false) {
    try {
        const output = await readUserdata('accounts');
        const outputArray = Object.entries(output);
        if (!password && password !== "") {
            return outputArray.find(entry => entry[1]['email'] === email.toLowerCase());
        } else {
            return outputArray.find(entry => entry[1]['email'] === email.toLowerCase() && entry[1]['password'] === password);
        }
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
    return await response.json();
}