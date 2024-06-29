let privacyCheckboxActive = false;
let passwordCreateInputHidden = true;
let passwordValidationInputHidden = true;
let passwordInputHidden = true;
let rememberMe = false;

const BASE_URL = 'https://remotestorage-3b1e6-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Toggles the remember me state.
 * This function inverses the value of the global variable `rememberMe`.
 */
function toggleRemember() {
    rememberMe = !rememberMe;
}


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
 * Attempts to create a new user account with the provided email, name, and password.
 * If the email does not already exist, a new user is created and the data is posted.
 * If the email already exists, the function returns false.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if the user was created successfully,
 *                               or false if the email already exists.
 */
async function createUser() {
    const email = document.getElementById('email').value.toLowerCase();
    if (!await accountExists(email)) {
        const user = document.getElementById('name').value;
        const password = document.getElementById('password-create').value;
        await postData('accounts', { 'name': user, 'email': email, 'password': password });
        return true;
    } else {
        return false;
    }
}


/**
 * Attempts to log in a user with the provided email and password.
 * If the login is successful, the user is redirected to the summary page.
 * If the login fails, a warning is logged to the console.
 *
 * @returns {Promise<void>} - A promise that resolves when the login attempt is complete.
 */
async function login() {
    const account = document.getElementById('email-login').value.toLowerCase();
    const password = document.getElementById('password-login').value;
    const myAccount = await accountExists(account, password);
    if (myAccount) {
        window.location.replace("./summary.html");
    } else if (!await accountExists(account)){
        document.getElementById('missmatch-mail').classList.remove('d-none');
        document.getElementById('missmatch-pw').classList.add('d-none');
    } else {
        document.getElementById('missmatch-mail').classList.add('d-none');
        document.getElementById('missmatch-pw').classList.remove('d-none');
    }
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
function compareRegistrationPasswords() {
    let create = document.getElementById('password-create');
    let validation = document.getElementById('password-validation');
    let showError = document.getElementById('error-msg');
    if (passwordInputMissmatch(create, validation)) {
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
function passwordInputMissmatch(password, validationPassword) {
    return validationPassword.value && password.value != validationPassword.value;
}


/**
 * try to submit sign-up-form/use html form-validation.
 * if everything is valid, try to createUser().
 * If createUser() is possible, animate the success-overlay and close popup after the animation is done.
 * Otherwise warn, that user-account is allready existing.
 */
async function submitSignUp() {
    if (document.getElementById('sign-up-form').checkValidity()) {
        if (await createUser()) {
            signUpAnimation(true, 'You Signed Up successfully');
        } else {
            signUpAnimation(false, 'This Account allready exists');
        };
    } else {
        document.getElementById('sign-up-form').reportValidity();
    }
}

/**
 * Fade-In of popup-msg
 * @param {boolean} success - true, if a new account could be created
 * @param {string} msg - Content of popup
 */
function signUpAnimation(success, msg) {
    const signUp = document.getElementById('sign-up-confirm').classList;
    const msgWrapper = document.getElementById('msg-wrapper').classList;
    document.getElementById('popup-msg-text').innerHTML = msg;
    signUp.add('popup-msg--fade-in');
    msgWrapper.add('msg-wrapper--z-push');

    setTimeout(() => {
        success && closeSignUp();
        signUp.remove('popup-msg--fade-in');
        msgWrapper.remove('msg-wrapper--z-push');
    }, success ? 1000 : 2000);
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
    compareRegistrationPasswords();
}

/**
 * Removes display: none from sign-up-dialog to give access to the sign-up-form
 */
function openSignUp() {
    document.getElementById('sign-up-overlay').classList.remove('d-none');
    document.getElementById('login-wrapper').classList.add('d-none');
}