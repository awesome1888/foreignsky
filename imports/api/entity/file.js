import BaseEntity from './base.js';
import FileCollection from '../collection/file.js';

class FileEntity extends BaseEntity
{
	get collectionClass()
	{
		return FileCollection;
	}
}

export {FileEntity};
export default FileEntity.getInstance();