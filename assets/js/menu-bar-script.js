/**
 * let for testreasons. Could become a const later on - related on the method we will use to prove a user is logged in
 * required to turn off side-menu-links 
 */

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    updateMenu();
}

/**
 * fetchs the currently open html-file-name and removes .html.
 * This function is used to handle the navigation-design.
 * @returns string with current file.html
 */
function getCurrentFileName() {
    const path = window.location.pathname;
    let fileName = path.substring(path.lastIndexOf('/') + 1);
    return fileName.replace('.html', '');
}

/**
 * Updates Design for the side- and bottom-navigation when entering a new page.
 */
function updateMenu() {
    const currentlyOpen = getCurrentFileName();
    if (regularMenuPoint(currentlyOpen)) {
        const menuitemDesk = document.getElementById(`${currentlyOpen}-desk-link`);
        const menuitemMobile = document.getElementById(`${currentlyOpen}-mobile-link`);
        menuitemDesk.href = '#'; menuitemMobile.href = '#';
        menuitemDesk.classList.add('active');
        menuitemMobile.classList.add('active');
    } else if (currentlyOpen && currentlyOpen != 'index' && currentlyOpen != 'help') {
        const menuitem = document.getElementById(`${currentlyOpen}-link`);
        menuitem.href = '#';
        menuitem.classList.add('active');
        !userId && hideMenu();
    }
    setMyAvatar(currentlyOpen);
}


/**
 * Hides the menu bars by adding the 'd-none' class to the menu elements.
 * This function targets the elements with the IDs 'menu-bar-two' and 'menu-bar-mobile',
 * and adds the 'd-none' class to both, making them hidden.
 */
function hideMenu() {
    hideWindow('menu-bar-two');
    hideWindow('menu-bar-mobile');
    hideWindow('header-mobile__right-content');
    hideWindow('header-desktop__right-content');
    document.getElementById('main-wrapper').setAttribute('style', 'margin-bottom: 0');
}

/**
 * Used for if-statement readability
 * @param {string} currentPoint 
 * @returns true, when it's not a special-page, or false when it is<br><br>
 */
function regularMenuPoint(currentPoint) {
    const specialPages = ["privacy", "legal_notice", "help", "index", ""];
    return !specialPages.includes(currentPoint);
}


/**
 * Get the Initials for the Avatar-Divs and call avatarHtml to write the innerHtml.
 * If no Initials there, use the string 'G' for "Guest".
 */
async function setMyAvatar(currentFile) {
    const myData = await readData(`accounts/${userId}`);
        const myInitials = myData ? initials(myData.name) : null;
        if (!myInitials) {
            forceLogout(currentFile);
        } else if (currentFile && currentFile != 'index') {
            avatarHtml(myInitials);
        }
}

/**
 * Force autoLogout, when currentFile is not part of the allowedFiles-array
 * @param {string} currentFile - currently visited .html-file
 */
function forceLogout(currentFile) {
    const allowedFiles = ['index', 'legal_notice', 'privacy'];
    if (currentFile && !allowedFiles.includes(currentFile)) {
        clearLocalstorage();
        window.location.replace('../index.html');
    }
}