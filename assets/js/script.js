const colors = [
    '#FF7A00', '#FF5EB3', '#6E52FF',
    '#9327FF', '#00BEE8', '#1FD7C1',
    '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B',
    '#FFE62B', '#FF4646', '#FFBB2B'
];

let passwordInputHidden = true;
let rememberMe = false;

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
}

function toggleRemember() {
    rememberMe = !rememberMe;
}