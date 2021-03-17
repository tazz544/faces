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

const port = process.env.port || 3000;
app.listen(port, '0.0.0.0', () => console.log(`Listening on port: ${port}`));
