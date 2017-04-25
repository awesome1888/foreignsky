import BaseEntity from './base.js';
import EmbedCollection from '../collection/embed.js';

class EmbedEntity extends BaseEntity
{
	get collectionClass()
	{
		return EmbedCollection;
	}
}

export {EmbedEntity};
export default EmbedEntity.getInstance();