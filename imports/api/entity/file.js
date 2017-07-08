import BaseEntity from './base.js';
import FileCollection from '../collection/file.js';
import Util from '../../../imports/lib/util.js';

class FileEntity extends BaseEntity
{
	get collectionClass()
	{
		return FileCollection;
	}

	static get localFolderAbsolute()
    {
	    return Util.getAssetsFolder()+this.localFolder;
    }

    static get localFolder()
    {
	    return 'img/';
    }

    static convertToUrl(path)
    {
	    if (!_.isStringNotEmpty(path))
        {
            return '';
        }
        return path.replace(/^public/i, '');
    }

    static add(path, name = 'File')
    {
        return FileCollection.insert({
            path: this.localFolder+path,
            name,
        });
    }
}

export {FileEntity};
export default FileEntity.getInstance();
