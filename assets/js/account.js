let privacyCheckboxActive = false;
let passwordCreateInputHidden = true;
let passwordValidationInputHidden = true;
const BASE_URL = 'https://remotestorage-3b1e6-default-rtdb.europe-west1.firebasedatabase.app/';


/**
 * Submits a POST-Query to Firebase
 * @param {string} path - Subpath at Firebase-Server
 * @param {Object} data - Data-Object transmitted 
 * @returns {Promise<Object>}
 */
async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/**
 * Connects to fire-base to create a new user-accounts
 */
async function createUser() {
    const email = document.getElementById('email').value;
    if (!await accountExists(email)) {
        const user = document.getElementById('name').value;
        const password = document.getElementById('password-create').value;
        await postData('accounts', { 'name': user, 'email': email, 'password': password });
        return true;
    } else {
        return false;
    }
}

async function accountExists(email) {
    try {
        const output = await readUserdata();
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
async function readUserdata(path = 'accounts') {
    const response = await fetch(BASE_URL + path + '.json');
    const responseToJason = await response.json();
    return responseToJason;

}


async function login() {
    const account = document.getElementById('email-login').value.toLowerCase();
    const password = document.getElementById('password-login').value;
    const userData = readUserdata()
    let userKeysArray = Object.keys(userData);
    for (let i = 0; i < userKeysArray.length; i++) {
        if (compareLoginInformation(account, password, userData, userKeysArray[i])) {
            window.location.replace("./summary.html");
            break;
        }
    }
}


/**
 * @param {string} account - documentId.value
 * @param {string} password - documentId.value
 * @param {json} json 
 * @param {*} key 
 * @returns {boolean} - returns true or false as condition for an if-statement
 */
function compareLoginInformation(account, password, json, key) {
    return account === json[key]['email'] && password === json[key]['password'];
}


/**
 * sets the value of privacyCheckboxActive to the opposite and 
 * disables or enables the submit-button based on the new value
 */
function togglePrivacy() {
    privacyCheckboxActive = !privacyCheckboxActive;
    if (privacyCheckboxActive) {
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-btn').classList.remove('disabled');
    } else {
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('submit-btn').classList.add('disabled');
    }
}

/**
 * toggles the currrent show/hide-password variable. 
 * calls the required function to set the correct eye-icon on input-field.
 * @param {string} id - string is create or validation
 */
function togglePasswordDesign(id) {
    if (id == 'create') {
        passwordCreateInputHidden = !passwordCreateInputHidden;
        setPasswordCreateDesign();
    } if (id == 'validation') {
        passwordValidationInputHidden = !passwordValidationInputHidden;
        setPasswordValidationDesign();
    } else {
        passwordInputHidden = !passwordInputHidden;
        setPasswordDesign();
    }
}

/**
 * on password-create field:
 * swaps out the lock-image for the eye-image or vice vera.
 * swaps out the password-type for a text-type or vice versa.
 */
function setPasswordCreateDesign() {
    let targetInput = document.getElementById(`password-create`);
    let targetImage = document.getElementById(`password-create-img`);
    if (passwordCreateInputHidden) {
        targetImage.src = './assets/img/icons/visibility_off.svg';
        targetInput.type = 'password';
    } else {
        targetImage.src = './assets/img/icons/visibility.svg';
        targetInput.type = 'text';
    }
}

/**
 * on password-validation field:
 * swaps out the lock-image for the eye-image or vice vera.
 * swaps out the password-type for a text-type or vice versa.
 */
function setPasswordValidationDesign() {
    let targetInput = document.getElementById(`password-validation`);
    let targetImage = document.getElementById(`password-validation-img`);
    if (passwordValidationInputHidden) {
        targetImage.src = './assets/img/icons/visibility_off.svg';
        targetInput.type = 'password';
    } else {
        targetImage.src = './assets/img/icons/visibility.svg';
        targetInput.type = 'text';
    }
}

/**
 * on password-validation field:
 * swaps out the lock-image for the eye-image or vice vera.
 * swaps out the password-type for a text-type or vice versa.
 */
function setPasswordDesign() {
    let targetInput = document.getElementById(`password-login`);
    let targetImage = document.getElementById(`password-login-img`);
    if (passwordInputHidden) {
        targetImage.src = './assets/img/icons/visibility_off.svg';
        targetInput.type = 'password';
    } else {
        targetImage.src = './assets/img/icons/visibility.svg';
        targetInput.type = 'text';
    }
}

/**
 * evaluates value of both password-inputs. if a value is set, it will call the setPasswordInputDesign-Function
 * and also add a pointer class + set an onclick attribute to toggle hide/show-password-variables.
 * otherwise it will reset those changes.
 * @param {string} id - string is create or validation
 */
function passwordInputIcon(id) {
    let targetInput = document.getElementById(`password-${id}`);
    let targetImage = document.getElementById(`password-${id}-img`);
    if (targetInput.value) {
        targetImage.classList.add('pointer');
        id == 'create' ? setPasswordCreateDesign() : id == 'validate' ? setPasswordValidationDesign() : setPasswordDesign();
        targetImage.setAttribute('onclick', `togglePasswordDesign('${id}')`);
    } else {
        targetImage.classList.remove('pointer');
        targetImage.setAttribute('onclick', '');
        targetImage.src = './assets/img/icons/lock.svg';
    }
}


/** 
 * compares both password fields during sign-up. 
 * comparsion starts, when the validation field gets a value
 */
function comparePasswords() {
    let create = document.getElementById('password-create');
    let validation = document.getElementById('password-validation');
    let showError = document.getElementById('error-msg');
    if (passwordMissmatch(create, validation)) {
        showError.classList.remove('d-none');
        create.classList.add('error'); validation.classList.add('error');
        document.getElementById('password-check').classList.add('password-check');
    } else {
        showError.classList.add('d-none');
        create.classList.remove('error'); validation.classList.remove('error');
        document.getElementById('password-check').classList.remove('password-check');
    }
}

/**
 * Statement, checking validationPassword for a existing value.
 * if a value is given, and it's the same than the regular-password, return true.
 * @param {Element} password 
 * @param {Element} validationPassword 
 * @returns true or false<br><br>
 */
function passwordMissmatch(password, validationPassword) {
    return validationPassword.value && password.value != validationPassword.value;
}


/**
 * try to submit sign-up-form/use html form-validation.
 * if everything is valid, animate the success-overlay and close popup after the animation is done
 * @param {event} event 
 */
async function submitSignUp() {
    if (document.getElementById('sign-up-form').checkValidity()) {
        if (await createUser()) {
            signUpAnimation();
        } else {
            console.warn('Dieser Account existiert bereits!');
        };
    } else {
        document.getElementById('sign-up-form').reportValidity();
    }
}

function signUpAnimation() {
    const signUp = document.getElementById('sign-up-confirm').classList;
    signUp.add('popup-msg--fade-in');
    const msgWrapper = document.getElementById('msg-wrapper').classList;
    msgWrapper.add('msg-wrapper--z-push');
    setTimeout(() => {
        closeSignUp();
        signUp.remove('popup-msg--fade-in');
        msgWrapper.remove('msg-wrapper--z-push');
    }, 1000);
}


/**
 * Resets every input.value of sign-up-dialog. 
 * Also resets images by passwordInputIcon()
 * does another password compare, to reset missmatch-msg.
 */
function closeSignUp() {
    document.getElementById('sign-up-overlay').classList.add('d-none');
    document.getElementById('login-wrapper').classList.remove('d-none');
    privacyCheckboxActive = false;
    passwordCreateInputHidden = true;
    passwordValidationInputHidden = true;
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password-create').value = '';
    document.getElementById('password-validation').value = '';
    passwordInputIcon('create');
    passwordInputIcon('validation');
    comparePasswords();
}

/**
 * Removes display: none from sign-up-dialog to give access to the sign-up-form
 */
function openSignUp() {
    document.getElementById('sign-up-overlay').classList.remove('d-none');
    document.getElementById('login-wrapper').classList.add('d-none');
}