let privacyCheckboxActive = false;
let passwordCreateInputHidden = true;
let passwordValidationInputHidden = true;

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
        id == 'create' ? setPasswordCreateDesign() : id == 'validate' ?  setPasswordValidationDesign() : setPasswordDesign();
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
    if (validation.value && create.value != validation.value) {
        showError.classList.remove('d-none');
        document.getElementById('password-check').classList.add('password-check');
    } else {
        showError.classList.add('d-none');
        document.getElementById('password-check').classList.remove('password-check');
    }
}


/**
 * try to submit sign-up-form/use html form-validation.
 * if everything is valid, animate the success-overlay
 * @param {event} event 
 */
function submitSignUp(event) {
    event.preventDefault();
    if (document.getElementById('sign-up-form').checkValidity()) {
        document.getElementById('sign-up-confirm').classList.add('popup-msg--fade-in');
        document.getElementById('msg-wrapper').classList.add('msg-wrapper--z-push');
    } else {
        document.getElementById('sign-up-form').reportValidity();
    }
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

/**
 * Prevent event-bubbeling
 * @param {*} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
}