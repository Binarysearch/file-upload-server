import express = require('express');
import * as uuid from 'uuid';
const fs = require('fs')

const fileUpload = require('express-fileupload');

var staticS = require('node-static');

var fileServer = new staticS.Server();

const app = express();

app.use(fileUpload());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', function (req: any, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const date = new Date().toISOString();
    console.log(' ');
    console.log(`${date} --->  Upload request with body extra: '${req.body.extra}'`);
    console.log(`File mime type: '${file.mimetype}'`);
    console.log(`File size: '${file.size}'`);

    const extension = getExtension(file.mimetype);
    const fileName = uuid.v4() + extension;

    file.mv('./files/' + fileName, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200);
        res.json({ name: fileName });
    });
});

app.get('/*', (req, res) => {
    const date = new Date().toISOString();
    console.log(' ');
    console.log(`${date} --->  Get request`, req.url);
    const path = './files' + req.url;

    try {
        if (fs.existsSync(path)) {
            fileServer.serveFile(path, 200, {}, req, res);
        } else {
            res.status(404);
            res.end();
        }
    } catch (err) {
        console.error(err);
        res.status(404);
        res.end();
    }
});

app.listen(3000);

function getExtension(mimetype: string): string {

    const extensionsByMimeType = {
        'image/jpeg': '.jpg',
        'image/gif': '.gif',
    }

    const extension = extensionsByMimeType[mimetype] || '';
    return extension;
};