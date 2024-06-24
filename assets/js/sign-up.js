let privacyCheckboxActive = false;


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