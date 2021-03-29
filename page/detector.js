'use strict';

const faceDetectorOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

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
 * Loads detector model
 * @returns {Promise<void>}
 */
const loadDetector = async () => {
    toggleLoader(true, 'Loading model...');
    await faceapi.nets.ssdMobilenetv1.load('/');
    await faceapi.loadFaceLandmarkModel('/');
    await faceapi.loadFaceRecognitionModel('/');
    toggleLoader(false);
}
