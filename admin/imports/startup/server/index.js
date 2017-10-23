// Import server startup through a single index entry point

import '../../api/index.server.js';
import './fixtures/index.js';
import './routine/index.js';

import FileUploader from '../../lib/util/file-uploader/server.js';
FileUploader.initialize();
