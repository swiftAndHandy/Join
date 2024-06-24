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
    } else {
        document.getElementById('submit-btn').disabled = true;
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
    } else {
        passwordValidationInputHidden = !passwordValidationInputHidden;
        setPasswordValidationDesign();
    }
}

/**
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
        id == 'create' ? setPasswordCreateDesign() : setPasswordValidationDesign();
        targetImage.setAttribute('onclick', `togglePasswordDesign('${id}')`);
    } else {
        targetImage.classList.remove('pointer');
        targetImage.setAttribute('onclick', '');
        targetImage.src = './assets/img/icons/lock.svg';
    }
}


function comparePasswords() {
    let create = document.getElementById('password-create');
    let validation = document.getElementById('password-validation');
    let showError = document.getElementById('error-msg');
    if (validation.value) {
        if (create.value != validation.value) {
            showError.classList.remove('d-none');
            document.getElementById('password-check').classList.add('password-check');
        } else {
            showError.classList.add('d-none');
        }
    }
}