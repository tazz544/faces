'use strict';

const faceDetectorOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

/**
 * Returns image and canvas HTML elements
 * @param sectionIndex: number
 * @returns {{imageEl: HTMLElement, canvasEl: HTMLElement}}
 */
const getElementsForSectionIndex = (sectionIndex) => {
    const sectionEl = document.getElementsByClassName('section')[sectionIndex];
    const canvasEl = sectionEl.getElementsByTagName('canvas')[0];
    const imageEl = sectionEl.getElementsByTagName('img')[0];
    return {
        canvasEl,
        imageEl
    }
}

/**
 * Returns face detections
 * @param imageEl: HTMLElement
 * @param canvasEl: HTMLElement
 * @returns {Promise<FaceDetection[]>}
 */
const detectResults = async (imageEl, canvasEl) => {
    const context = canvasEl.getContext('2d');
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);

    const results = await faceapi
        .detectAllFaces(imageEl, faceDetectorOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
    faceapi.matchDimensions(canvasEl, imageEl);
    return results;
}

/**
 * Toggles section visibility
 * @param sectionIndex: number
 * @param state: boolean
 */
const toggleSection = (sectionIndex, state) => {
    const sections = document.getElementsByClassName('section');
    const sectionEl = sections[sectionIndex];
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
