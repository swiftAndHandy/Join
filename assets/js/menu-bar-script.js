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
    } else {
        const menuitem = document.getElementById(`${currentlyOpen}-link`);
        menuitem.href = '#';
        menuitem.classList.add('active');
    }
}

/**
 * Used for if-statement readability
 * @param {string} currentPoint 
 * @returns true, when it's not a special-page, or false when it is<br><br>
 */
function regularMenuPoint(currentPoint) {
    const specialPages = ["privacy", "legal_notice", "help"];
    return !specialPages.includes(currentPoint);
}