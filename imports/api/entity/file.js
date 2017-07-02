import BaseEntity from './base.js';
import FileCollection from '../collection/file.js';
import Util from '../../../imports/lib/util.js';

class FileEntity extends BaseEntity
{
	get collectionClass()
	{
		return FileCollection;
	}

	static get localFolderAbsolute() {
	    return Util.getProjectFolder()+this.localFolder;
    }

    static get localFolder() {
	    return 'public/img/';
    }

    static convertToUrl(path) {
	    if (!_.isStringNotEmpty(path))
        {
            return '';
        }
        return path.replace(/^public/i, '');
    }
}

export {FileEntity};
export default FileEntity.getInstance();