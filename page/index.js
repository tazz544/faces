'use strict';

let faceMatcher = null;
let notYouDetections = [];

/**
 * Downloads result
 */
const download = () => {
    const link = document.createElement('a');
    const resultCanvasEl = document.getElementById('result');
    const img = resultCanvasEl.toDataURL('image/png');
    link.download = 'result.png';
    link.href = img;
    link.click();
}

/**
 * Updates final result
 * @returns {Promise<void>}
 */
const updateFinalResult = async () => {
    const resultCanvasEl = document.getElementById('result');
    const {canvasEl, imageEl} = getElementsForSectionIndex(1);
    const ctx = resultCanvasEl.getContext('2d');
    const img = new Image();

    img.onload = () => {
        resultCanvasEl.width = canvasEl.width;
        resultCanvasEl.height = canvasEl.height;
        const scale = Math.min(resultCanvasEl.width / img.width, resultCanvasEl.height / img.height);
        const x = (resultCanvasEl.width / 2) - (img.width / 2) * scale;
        const y = (resultCanvasEl.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        notYouDetections.forEach(detection => {
            const {box} = detection;
            StackBlur.canvasRGB(
                resultCanvasEl,
                Math.floor(box.x),
                Math.floor(box.y),
                Math.floor(box.width),
                Math.floor(box.height),
                12
            );
        })
    }
    img.src = imageEl.src;
}

/**
 * Updates group photo
 * @returns {Promise<boolean>}
 */
const updateGroup = async () => {
    const {canvasEl, imageEl} = getElementsForSectionIndex(1);
    notYouDetections = [];

    const results = await detectResults(imageEl, canvasEl);
    const isValid = validateGroup(results);

    if (isValid) {
        const resizedResults = faceapi.resizeResults(results, imageEl);
        resizedResults.forEach(({ detection, descriptor }) => {
            let label = faceMatcher.findBestMatch(descriptor).toString();
            if (label.includes('unknown')) {
                notYouDetections.push(detection);
                label = 'Not you';
            } else {
                label = 'You (probably)';
            }
            const options = { label };
            const drawBox = new faceapi.draw.DrawBox(detection.box, options);

            drawBox.draw(canvasEl);
        });
        await updateFinalResult();
    }
    return isValid;
}

/**
 * Updates reference
 * @returns {Promise<boolean>}
 */
const updateReference = async () => {
    toggleSection(1, false);
    toggleSection(2, false);
    const {canvasEl, imageEl} = getElementsForSectionIndex(0);

    const results = await detectResults(imageEl, canvasEl);
    const isValid = validateReference(results);

    if (isValid) {
        faceMatcher = new faceapi.FaceMatcher(results);
        const resizedResult = faceapi.resizeResults(results, imageEl)[0];
        const { detection } = resizedResult;
        const label = `That's you (probably)`;
        const options = { label };
        const drawBox = new faceapi.draw.DrawBox(detection.box, options);
        drawBox.draw(canvasEl);
    }
    return isValid;
}

/**
 * Set observer on input change
 * @param sectionIndex
 * @param updateFunction
 * @returns {Promise<void>}
 */
const observeFileInput = async (sectionIndex, updateFunction) => {
    const {fileInputEl, imageEl} = getElementsForSectionIndex(sectionIndex);
    fileInputEl.onchange = async () => {
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            toggleLoader(true, `Processing image...`);
            const file = fileInputEl.files[0];
            const image = await faceapi.bufferToImage(file);
            imageEl.src = image.src;
            const isValid = await updateFunction();
            toggleSection(sectionIndex + 1, isValid);
            toggleLoader(false);
        }
    }
}

/**
 * Init
 * @returns {Promise<void>}
 */
const init = async () => {
    observeFileInput(0, updateReference);
    observeFileInput(1, updateGroup);
    await loadDetector();
    setTimeout(() => toggleSection(0, true), 500);
}

(() => init())();
