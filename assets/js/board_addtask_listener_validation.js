
  /**
   * checks if clicked outside of the category containers when true it will close it 
   */
  function catgeoryClickOutsideclose() {
    document.addEventListener('click', function(event) {
      const dropMenu = document.getElementById('category-drop-menu');
      const categoryInputWrapper = document.getElementById('category-input-wrapper');
      
      if (!categoryInputWrapper.contains(event.target)) {
        dropMenu.classList.add('d-none');
      }
    });
  }


/**
 * Removes validation error messages when fields are filled out
 */
function removeValidation() {
    const form = document.querySelector('#form-desktop');
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    const selectCategoryDiv = document.getElementById('category-input-wrapper');
    const errorMessageCategory = selectCategoryDiv.parentNode.querySelector('.error-message');
    if (errorMessageCategory) {
        errorMessageCategory.remove();
    }
  }


  /**
 * Creates custom validation error messages when form fields are not filled.
 */
  function ownValidation() {
    const form = document.querySelector('#form-desktop');
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (field.value.trim() === '' && !field.parentNode.querySelector('.error-message')) {
            const errorMessage = document.createElement('span');
            errorMessage.textContent = 'This field is required.';
            errorMessage.classList.add('error-message');
            errorMessage.style.marginBottom = '-30px'; // Hier wird der Abstand hinzugefügt
            field.parentNode.appendChild(errorMessage);
        }
        field.addEventListener('input', function() {
            if (field.value.trim() !== '') {
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }});});}

            
/**
 * sets min of the same day
 */
function setDateMin() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('task-due-date').setAttribute('min', today);
  document.getElementById('update-date') && document.getElementById('update-date').setAttribute('min', today);
}
  

/**
 * checks the category field because it can't have the required tag but is required for the form to be filled.
 */
function checkCategoryfield() {
  const selectCategoryDiv = document.getElementById('category-input-wrapper');
  const selectedCategory = selectCategoryDiv.innerText.trim();
  if (selectedCategory !== 'Technical Task' && selectedCategory !== 'User Story') {
    if (!selectCategoryDiv.parentNode.querySelector('.error-message')) {
      const errorMessage = document.createElement('span');
      errorMessage.textContent = 'This field ist required.';
      errorMessage.classList.add('error-message');
      selectCategoryDiv.parentNode.appendChild(errorMessage);
    }
  } else {
    const errorMessage = selectCategoryDiv.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

}
