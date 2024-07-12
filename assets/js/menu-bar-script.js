const currentlyOpen = getCurrentFileName();

/**
 * query-selects all Elements that have a w3-include-attribute and starts to fetch the file 
 * that is assigned to the attribute.
 * Triggers the updateMenu-Funktion
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
 * Toggles (and hides) the Avatar-Dropdown-Menu
 * @param {boolean} toggle - true if the user clicks on an the avatar-menu-button, false in generell
 */
function showOverlayMenu(toggle = false) {
    if (toggle) {
        document.getElementById('menu-bar-avatar').classList.toggle('show-overlay-menu');
        document.getElementById('menu-bar-avatar-mobile').classList.toggle('show-overlay-menu');
    } else {
        document.getElementById('menu-bar-avatar').classList.remove('show-overlay-menu');
        document.getElementById('menu-bar-avatar-mobile').classList.remove('show-overlay-menu');
    }
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
            setupAvatarMenu();
        }
}


/**
 * Installs an eventListener on the whole document, listening for clicks.
 * clickedOnAvatar is true, if the click happens on an element in dropDownMenus[], otherwise false.
 * clickedOnIgnored is true, if the click happens on the dropdown-menus themself. 
 * If the user is clicking on the Avatar the overlay is shown.  Since the ignores items are childs of the Avatars.
 * So a click on ignored causes allways a true on a click on avatar. That why it also requires clickedOnIgnores false in first condition.
 * If it's neither a click on Avatar nor the Menu itself, close the overlay-Menu.
 */
function setupAvatarMenu() {
    const dropDownMenus = [document.getElementById('my-avatar-mobile'), document.getElementById('my-avatar-desktop')];
    const ignore = [document.getElementById('menu-bar-avatar'), document.getElementById('menu-bar-avatar-mobile')];

    document.addEventListener('click', (event) => {
        const clickedOnAvatar = dropDownMenus.some(element => element.contains(event.target));
        const clickedOnIgnored = ignore.some(element => element.contains(event.target));
        clickedOnAvatar && !clickedOnIgnored ? showOverlayMenu(true) : !clickedOnIgnored ? showOverlayMenu(false) : false;
    });
}

/**
 * Force autoLogout, when currentFile is not part of the allowedFiles-array
 * @param {string} currentFile - currently visited .html-file
 */
function forceLogout(currentFile) {
    const allowedFiles = ['index', 'legal_notice', 'privacy'];
    if (currentFile && !allowedFiles.includes(currentFile)) {
        logout();
    }
}

/**
 * Updates Content of Menu-Bar-Avatar
 * @param {string} content - Initials of logged in Account or - if not logged in 'G'.
 */
function avatarHtml(content) {
    document.getElementById('my-avatar-desktop').insertAdjacentHTML('afterbegin', content);
    document.getElementById('my-avatar-mobile').insertAdjacentHTML('afterbegin', content);
}