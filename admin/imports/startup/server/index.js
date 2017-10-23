// Import server startup through a single index entry point

import '../../api/index.server.js';
import './fixtures/index.js';
import './routine/index.js';

import formidable from 'formidable';

import FileUploader from '../../lib/util/file-uploader/server.js';
// FileUploader.initialize();

WebApp.connectHandlers.use('/upload', (req, res, next) => {

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

        console.dir('!!!');
        if (!err)
        {
            console.dir(fields);
            console.dir(files);
        }
        else
        {
            console.dir(err);
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            all: 'ok!',
        }));
    });
});
