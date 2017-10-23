// Import server startup through a single index entry point

import '../../api/index.server.js';
import './fixtures/index.js';
import './routine/index.js';

// import FileUploader from '../../lib/util/file-uploader/server.js';
// FileUploader.initialize();

WebApp.connectHandlers.use('/hello', (req, res, next) => {
    console.dir('!!!');
    res.writeHead(200);
    res.end(`Hello world from: ${Meteor.release}`);
});
