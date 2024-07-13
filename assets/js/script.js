const BASE_URL = 'https://join-256-default-rtdb.europe-west1.firebasedatabase.app/';
const userId = localStorage.getItem('id');

/**
 * @returns colors - a random element of global const colors. 
 * e. g.: use this when you add a new contact, that hasn't a own user-account
 */
function applyRandomColor() {
    const colors = [
        '#FF7A00', '#9327FF', '#6E52FF',
        '#FC71FF', '#FFBB2B', '#1FD7C1',
        '#462F8A', '#FF4646', '#00BEE8',
        '#FF7A00'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
 * Generates a randomized string, based on Timestamp, that can be used to prevent two generated items will get the same ID.
 * @returns {string}
 */
function randomId() {
    return Math.random().toString(36).slice(2, 9) + '-' + Date.now();
}

//needs some changes to make this usable in every situation -> date from firebase as param
function taskDueDate(date) {
    date = new Date(date);
    let dateOption = { month: "long", day: "numeric", year: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", dateOption);
    return formattedDate;
  }

/**
 * Sorts contacts by name alphabetically.
 * 
 * @param {Object[]} data - The array of contact objects.
 * @returns {Object[]} The sorted array of contacts with an additional key.
 */
function sortByAlphabet(data) {
    let entries = Object.entries(data).map(([id, contact]) => ({ 
        id, ...contact
    }));
    return entries.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Capitalizes the first letter of the input string and converts the rest to lowercase.
 * Capitalizes the first letter after a '-' to avoid double-names-issues.
 *
 * @param {string} input - The string to be formatted.
 * @returns {string} - The formatted string with the first letter capitalized and the rest in lowercase.
 */
function capitaliseFirstLetters(input) {
    input = input.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    return input.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}


/**
 * Applys d-none or removes d-none from 
 * @param {Element} id - the document.elementId that is planed to change
 * @param {boolean} method - hideWindow is true -> hideWindow. hideWindow is false? Show it.
 */
function hideWindow(id, method = true) {
    let target = document.getElementById(id);
    method ? target.classList.add('d-none') : target.classList.remove('d-none');
    return target;
}

/**
 * Triggers a localStorage clear and replaces the url to index to logout the user.
 */
function logout() {
    clearLocalstorage();
    window.location.replace('../index.html');
}


/**
 * clear localStorage()
 */
function clearLocalstorage() {
    localStorage.removeItem('id');
    localStorage.removeItem('login');
}

/**
 * Used to get the initials of a Name.
 * @param {string} input - string to modify.
 * @returns - every first character of every word in input
 */
function initials(input) {
    try {
    return input.toUpperCase().split(' ').map(word => word.charAt(0)).join('');
    }
    catch (error) {
        return error;
    }
}

/**
 * Prevent event-bubbeling
 * @param {*} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
};


/**
 * Sends a PUT request to the specified path with the provided data.
 *
 * @param {Object} data - The data to be sent in the body of the PUT request. Defaults to an empty object.
 * * @param {string} path - The path to which the data should be sent. Defaults to an empty string.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function putDataset(data = {}, path = "") {
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
 * Sends a PUT request to the specified path with the provided data.
 *
 * @param {string} data - The datastring that's sent in the body of the PUT request. Defaults to an empty object.
 * * @param {string} path - The path to which the data should be sent. Defaults to an empty string.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function putData(value, path = "") {
    const response = await fetch(BASE_URL + path + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(value)
    });
    return await response.json();
}


/**
 * Submits a POST-Query to Firebase
 * @param {string} path - Subpath at Firebase-Server
 * @param {Object} data - Data-Object transmitted 
 * @returns {Promise<Object>}
 */
async function postData(data = {}, path = "") {
    try {
        const response = await fetch(BASE_URL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(`Submit data to Server failed.`)   
    }
}

/**
 * responseToJason is containing every user. It's iterated by every userKeyArray-Index to  
 * compare Login-Form-Information with provided server-information.
 * If a match is found, forward to summary.html. ToDo: Add LocalStorage??? Incognito-Mode?!
 * @param {string} path 
 */
async function readData(path) {
    try {
        const response = await fetch(BASE_URL + path + '.json');
        return await response.json();   
    }
    catch (error) {}
}

/**
 * Deletes data from firebase-storage
 * @param {string} path 
 * @returns -need to be added
 */
async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + '.json',{
            method: "DELETE",
        });
        return await response.json();   
    } catch (error) {}
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
        const output = await readData('accounts');
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
 * 
 * @param {string[]} subtaskArray - an Array with all subtask titles
 * @param {boolean} done - future state of subtask. normaly it's false when creating a new.
 * @returns - an Array with subtakObjects, containing name: string and done: boolean
 */
function createSubtasks() {
    let query = document.querySelectorAll('.subtaskitem')
    let result = [];
    
    query.forEach((item) => result.push(
        { 'goal': item.innerText, 'done': false }
    ));

    return result;
}

/**
 * This function adds an additional key: value to an existing ObjectObject
 * @param {string} prefix - prefix that should be added 
 * @param {Object} data - the data that has been fetched from firebase
 * @returns {Object} - the original data + a new key:value -> path: prefix + id
 */
function setPrefixToKey(prefix, data) {
    const prefixedData = {};
  
    for (const key in data) {
      const value = data[key];
      prefixedData[key] = { ...value, 'path': `${prefix}/${key}` };
    }
  
    return prefixedData;
  }


/**
 * Limits the length of a string to a chosen limit
 * @param {string} inputString - string, that should become limited in length
 * @param {int} limit - max-length of the string
 * @returns {string} - shortened string
 */
function limitLengthOf(inputString, limit = 80) {
    if (inputString.length > limit) {
      return inputString.substring(0, limit) + '...';
    }
    return inputString;
  }


/**
 * Checks if a given date is not in the past.
 * If the given date is in the past, it returns today's date.
 * Otherwise, it returns the given date.
 * @param {string} deadline - The date to be checked in the format 'yyyy-mm-dd'.
 * @returns {string} - Returns today's date if the given date is in the past, otherwise returns the given date.
 */
  function isNotInPast(deadline) {
    const today = new Date().toISOString().split('T')[0];
    let dateOfToday = new Date(today);
    let choosenDate = new Date(deadline);
    dateOfToday = dateOfToday.getTime()
    choosenDate = choosenDate.getTime()

    if (choosenDate < dateOfToday) {
        return today;
    } else {
        return deadline;
    }
}