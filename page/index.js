'use strict';

let faceMatcher = null;
let notYouDetections = [];

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
                12);
        })
    }
    img.src = imageEl.src;
}

const updateGroup = async () => {
    const {canvasEl, imageEl} = getElementsForSectionIndex(1);
    notYouDetections = [];

    const results = await detectResults(imageEl, canvasEl);
    const isValid = validateGroup(results);

    if (isValid) {
        const resizedResults = faceapi.resizeResults(results, imageEl);
        resizedResults.forEach(({ detection, descriptor }) => {
            const label = faceMatcher.findBestMatch(descriptor).toString();
            const options = { label: label.includes('unknown') ? 'Not you' : 'You (probably)' };
            const drawBox = new faceapi.draw.DrawBox(detection.box, options);
            if (label.includes('unknown')) {
                notYouDetections.push(detection);
            }
            drawBox.draw(canvasEl);
        });
        await updateFinalResult();
    }
    return isValid;
}

const updateReference = async () => {
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

const observeFileInput = async (sectionIndex, updateFunction) => {
    const sectionEl = document.getElementsByClassName('section')[sectionIndex];
    const fileInputEl = sectionEl.getElementsByTagName('input')[0];
    const imagePreviewEl = sectionEl.getElementsByTagName('img')[0];
    fileInputEl.onchange = async () => {
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            toggleLoader(true, `Processing image...`);
            const file = fileInputEl.files[0];
            const image = await faceapi.bufferToImage(file);
            imagePreviewEl.src = image.src;
            const isValid = await updateFunction();
            toggleSection(sectionIndex + 1, isValid);
            toggleLoader(false);
        }
    }
}

const init = async () => {
    observeFileInput(0, updateReference);
    observeFileInput(1, updateGroup);
    toggleLoader(true, 'Loading model...');
    await faceapi.nets.ssdMobilenetv1.load('/');
    await faceapi.loadFaceLandmarkModel('/');
    await faceapi.loadFaceRecognitionModel('/');
    toggleLoader(false);
    setTimeout(() => toggleSection(0, true), 500);
}

(() => init())();
