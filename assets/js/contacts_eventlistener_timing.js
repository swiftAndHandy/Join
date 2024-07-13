document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth >= 820) {
        return;
    }
    window.addEventListener('click', (event) => {
        if (!event.target.closest('#contact-options') && !event.target.closest('#more-vert-button')) {
            closeContactOptions();
        }
    });
});


/**
 * Handles window resize events to manage the visibility of the contact list and contact details.
 * If the window width is greater than 820 pixels, it shows the contact list and contact details.
 * If the window width is less than or equal to 820 pixels, it toggles the visibility of the contact 
 * list and contact details based on their current display states.
 */
function handleResize() {
    if (window.innerWidth > 820) {
        document.getElementById('contact-list-container').style.display = 'block';
        document.getElementById('contact-window').style.display = 'flex';
        document.getElementById('back-to-contacts-button').style.display = 'none';
    } else {
        let contactInfoContainer = document.getElementById('contact-info-container').style.display;
        if (contactInfoContainer === 'none' || contactInfoContainer === '') {
            document.getElementById('contact-list-container').style.display = 'block';
            document.getElementById('contact-window').style.display = 'none';
        } else {
            if (document.getElementById('contact-window').style.display === 'flex') {
                document.getElementById('contact-list-container').style.display = 'none';
                document.getElementById('back-to-contacts-button').style.display = 'flex';
            }
        }
    }
}

window.addEventListener('resize', handleResize);


/**
 * Shows the "Contact Created" modal with animations.
 * The modal appears, stays for 1.5s, then closes and resets.
 */
function showCreatedContactModal() {
    let contactCreatedModal = document.getElementById('contact-created-modal');
    const closeModal = () => {
        contactCreatedModal.classList.remove('contact-created-modal-close');
        contactCreatedModal.classList.remove('contact-created-modal-open');
        contactCreatedModal.style.display = 'none';
    };
    const showModal = (delay, openClass, closeClass) => {
        setTimeout(() => {
            contactCreatedModal.style.display = 'flex';
            contactCreatedModal.classList.add(openClass);
            setTimeout(() => {
                contactCreatedModal.classList.add(closeClass);
                closeModal();
            }, 190);
        }, delay);
    };
    showModal(500, 'contact-created-modal-open', 'contact-created-modal-close');
    executeOnMaxWidth(820, async () => {
        showModal(500, 'contact-created-modal-open-mobile', 'contact-created-modal-close-mobile');
    });
}

