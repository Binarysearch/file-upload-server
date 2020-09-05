import express = require('express');
import * as uuid from 'uuid';


const fileUpload = require('express-fileupload');

var staticS = require('node-static');

var fileServer = new staticS.Server();

const app = express();

app.use(fileUpload());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', function (req: any, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;
    console.log(file);
    const extension = getExtension(file.mimetype);
    const fileName = uuid.v4() + extension;

    // Use the mv() method to place the file somewhere on your server
    file.mv('./' + fileName, function (err) {
        if (err)
            return res.status(500).send(err);

        res.status(200);
        res.json({ name: fileName });
    });
});

app.get('/*', (req, res) => {
    console.log('get', req.url);
    fileServer.serveFile('.' + req.url, 200, {}, req, res);
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