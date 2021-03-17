'use strict';

const updateValidationErrors = (sectionIndex, validationErrorsArray) => {
    const sectionEl = document.getElementsByClassName('section')[sectionIndex];
    const validationEl = sectionEl.getElementsByClassName('validation')[0];
    let elements = '';
    validationErrorsArray.forEach(error => {
        elements += `<div class="validation__message">${error}</div>`
    });
    validationEl.innerHTML = elements;
}

const validateGroup = (results) => {
    const validationErrors = [];
    if (!results.length) {
        validationErrors.push(`We didn't find any face in this photo`);
    }
    if (results.length === 1) {
        validationErrors.push(`There is only one face in this photo`);
    }
    updateValidationErrors(1, validationErrors);
    return validationErrors.length === 0;
}

const validateReference = (results) => {
    const validationErrors = [];
    if (!results.length) {
        validationErrors.push(`We didn't find any face in this photo`);
    }
    if (results.length > 1) {
        validationErrors.push(`There is more than one face in this photo`);
    }
    updateValidationErrors(0, validationErrors);
    return validationErrors.length === 0;
}
