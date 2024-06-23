

/**
 * This function is used @summary.html to initalize everything.
 * Todo: Get Username and start greeting, when it's saved
 */
function initSummary() {
    greetAtLogin();
}

/**
 * Runs various functions, to use the correct greeting for users/guests.
 * To do: Check for Login/Username...
 */
function greetAtLogin() {
    const daytime = getDaytime();
    const greetingOverlay = document.getElementById('greeting-overlay');
    const greetingEmbedded = document.getElementById('greeting-embedded');
    const greetingMsg = generateGreetingHtml(daytime);
    greetingOverlay.innerHTML = greetingMsg;
    greetingEmbedded.innerHTML = greetingMsg;
    animateGreeting(greetingOverlay);
}

/**
 * @returns a string with the current daytime <br><br>
 */
function getDaytime() {
    const currentDate = new Date();
    const hours = currentDate.getHours();

    if (isMorning(hours)) {
        return 'morning';
    } else if (isAfternoon(hours)) {
        return hours === 12 ? 'noon' : 'afternoon';
    } else if (isEvening(hours)) {
        return 'evening';
    } else {
        return 'night';
    }
}

/**
 * @param {number} hours  new Date().getHours();
 * @returns true (hours between 6 or up to 11) or false<br><br>
 */
function isMorning(hours) {
    return hours >= 6 && hours < 12;
}

/**
 * @param {number} hours  new Date().getHours();
 * @returns true (hours between 12 and up to 17) or false<br><br>
 */
function isAfternoon(hours) {
    return hours >= 12 && hours < 18;
}

/**
 * @param {number} hours  new Date().getHours();
 * @returns true (hours between 18 and up to 23) or false<br><br>
 */
function isEvening(hours) {
    return hours >= 18 && hours < 24;
}

/**
 * This function controlls css classes, that are required for the login animation.
 * @param {Element} greeting - target HTML-Element.
 */
function animateGreeting(greeting) {
    greeting.classList.add('greeting-msg--mobile--fade-in');
    setTimeout(() => {
        greeting.classList.remove('greeting-msg--mobile--fade-in');
        setTimeout(() => {
            greeting.classList.add('d-none');
        }, 1000);
        document.getElementById('summary').classList.add('summary-animation--fade-in');
    }, 2000);
}