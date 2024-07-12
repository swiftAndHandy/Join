/**
 * This function is used @summary.html to initalize everything.
 * Adds an eventListener on every summary card, that leads to board.html when clicked.
 * This method is used to prevent regular link-style
 */
function initSummary() {
    includeHTML();
    greetAtLogin();
    document.querySelectorAll('.summary-card').forEach(card => {
        card.addEventListener('click', () => window.location.href = "./board.html");
    })
}

/**
 * Runs various functions, to use the correct greeting for users/guests.
 * To do: Check for Login/Username...
 */
async function greetAtLogin() {
    const daytime = getDaytime();
    const greetingOverlay = document.getElementById('greeting-overlay');
    const greetingEmbedded = document.getElementById('greeting-embedded');
    const userInformation = await readData(`accounts/${userId}`)
    const greetingMsg = await generateGreetingHtml(daytime, userInformation);
    greetingOverlay.innerHTML = greetingMsg;
    greetingEmbedded.innerHTML = greetingMsg;
    animateGreeting(greetingOverlay);
    updateBoardCounters();
}

/**
 * Generates the HTML-Code for Greeting a User or A Guest
 * @param {number} daytime 
 * @param {string} user 
 */
async function generateGreetingHtml(daytime, userInformation) {
    if (userId != 'guest' && userInformation) {
        return `<p>Good ${daytime},<br>
        <span class="greeting-msg--name">${userInformation.name}</span></p>`;
    } else {
        return `<p>Good ${daytime}!</p>`;
    }
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
    greeting.classList.add('greeting-msg--mobile--fade-out');
    document.getElementById('summary').classList.add('summary-animation--fade-in');
    setTimeout(() => {
        greeting.classList.add('d-none');
    }, 1600);
}


/**
 * Iterates trough every task in database.
 * Counts up every type is used in summary and updates the numbers.
 */
async function updateBoardCounters() {
    const data = await readData('tasks');
    const counters = { 'todo': 0, 'done': 0, 'board': 0, 'progress': 0, 'feedback': 0 };
    const urgents = [];
    for (let item in data) {
        const thisItem = data[item];
        counters[thisItem.status]++;
        counters.board++;
        if (thisItem.priority.toLowerCase() === 'urgent' && thisItem.status !== 'done') {
            urgents.push(thisItem.date);
        }
    }

    setOpenUrgents(urgents);

    for (let items in counters) {
        document.getElementById(`${items}-counter`).innerText = counters[items];
    }
}


/**
 * Renders the Text for Urgent Tasks, that are NOT done yet.
 */
function setOpenUrgents(urgents) {
    document.getElementById('urgent-counter').innerText = urgents.length;
    if (urgents.length > 0) {
        document.getElementById('deadline-date').innerText = taskDueDate(getDeadline(urgents)[0]);
        document.getElementById('deadline-description').innerText = 'Upcoming Deadline'
    } else {
        document.getElementById('deadline-description').innerHTML = '<b>No upcoming deadline.</b><br>Take a breath.'
    }
}


/**
 * @param {string[]} urgents - an array with date-strings, e. g. '2024-07-04'
 * @returns {Date[]} - Returns the dates sorted from earliest to latest.
 */
function getDeadline(datesArray) {
    return datesArray.sort((a, b) => new Date(a) - new Date(b));
}