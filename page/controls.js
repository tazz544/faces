'use strict';

/**
 * Returns image and canvas HTML elements
 * @param sectionIndex: number
 * @returns {{imageEl: HTMLElement, canvasEl: HTMLElement}}
 */
const getElementsForSectionIndex = (sectionIndex) => {
    const sectionEl = document.getElementsByClassName('section')[sectionIndex];
    const fileInputEl = sectionEl.getElementsByTagName('input')[0];
    const canvasEl = sectionEl.getElementsByTagName('canvas')[0];
    const imageEl = sectionEl.getElementsByTagName('img')[0];
    return {
        sectionEl,
        fileInputEl,
        canvasEl,
        imageEl
    }
}

/**
 * Toggles section visibility
 * @param sectionIndex: number
 * @param state: boolean
 */
const toggleSection = (sectionIndex, state) => {
    const {sectionEl} = getElementsForSectionIndex(sectionIndex);
    const imagePreviewEl = sectionEl.getElementsByTagName('img')[0];
    if (sectionEl) {
        sectionEl.style.display = state ? 'flex' : 'none';
    }
    if (!state && imagePreviewEl) {
        imagePreviewEl.src = '';
    }
}

/**
 * Toggles loader visibility
 * @param state: boolean
 * @param message: string
 */
const toggleLoader = (state, message) => {
    const loaderEl = document.getElementsByClassName('loader')[0];
    const loaderTextEl = loaderEl.getElementsByClassName('loader__text')[0];
    if (message) {
        loaderTextEl.innerText = message;
    }
    loaderEl.style.opacity = state ? '.9' : '0';
}
