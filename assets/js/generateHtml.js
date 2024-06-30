/**
 * Generates the HTML-Code for Greeting a User or A Guest
 * @param {number} daytime 
 * @param {string} user 
 */
async function generateGreetingHtml(daytime, userInformation) {
    if (userId) {
        return `<p>Good ${daytime},<br>
        <span class="greeting-msg--name">${userInformation.name}</span></p>`;
    } else {
        return `<p>Good ${daytime}!</p>`;
    }
}