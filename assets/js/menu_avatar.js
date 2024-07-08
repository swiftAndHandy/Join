let clickedButton = false;

function showOverlayMenu() {
    if(clickedButton === false) {
        document.getElementById('menu-bar-avatar').classList.add('show-overlay-menu');
        clickedButton = true;
    } else {
        document.getElementById('menu-bar-avatar').classList.remove('show-overlay-menu');
        clickedButton = false;
    }
}