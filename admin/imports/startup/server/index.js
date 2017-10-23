// Import server startup through a single index entry point

import '../../api/index.server.js';
import './fixtures/index.js';
import './routine/index.js';

import formidable from 'formidable';

import FileUploader from '../../lib/util/file-uploader/server.js';
// FileUploader.initialize();

WebApp.connectHandlers.use('/upload', (req, res, next) => {

    const form = new formidable.IncomingForm();
    console.dir(form);

    form.parse(req, (err, fields, files) => {

        if (!err)
        {
            console.dir(fields);
        }
        else
        {
            console.dir(err);
        }

        // next();
    });

    res.writeHead(200);
    res.end(JSON.stringify({
        all: 'ok!',
    }));
});
