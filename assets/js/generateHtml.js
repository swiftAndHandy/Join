/**
 * Generates the HTML-Code for Greeting a User or A Guest
 * @param {number} daytime 
 * @param {string} user 
 */
async function generateGreetingHtml(daytime, userInformation) {
    if (userId != 'guest') {
        return `<p>Good ${daytime},<br>
        <span class="greeting-msg--name">${userInformation.name}</span></p>`;
    } else {
        return `<p>Good ${daytime}!</p>`;
    }
}

/**
 * Updates Content of Menu-Bar-Avatar
 * @param {string} content - Initials of logged in Account or - if not logged in 'G'.
 */
function avatarHtml(content) {
    document.getElementById('my-avatar-desktop').innerHTML = content;
    document.getElementById('my-avatar-mobile').innerHTML = content;
}