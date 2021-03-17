const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pageDir = path.join(__dirname, 'page');
app.use(express.static(path.join(__dirname, 'page')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'weights')));
app.use(express.static(path.join(__dirname, 'node_modules/face-api.js/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/stackblur-canvas/dist')));

app.get('/', (req) => res.sendFile(pageDir));

app.listen(3000, () => console.log('Listening on port: 3000'));
