/**
 * Generates the HTML-Code for Greeting a User or A Guest
 * @param {number} daytime 
 * @param {string} user 
 */
function generateGreetingHtml(daytime, user = 'Sofia Müller') {
    if (user) {
        return `<p>Good ${daytime},<br>
        <span class="greeting-msg--name">${user}</span></p>`;
    } else {
        return `<p>Good ${daytime}!</p>`;
    }
}