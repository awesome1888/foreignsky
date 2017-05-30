import BaseEntity from './base.js';
import EmbedCollection from '../collection/embed.js';
import EmbedItemCollection from '../collection/embed/item.js';

class EmbedEntity extends BaseEntity
{
	get collectionClass()
	{
		return EmbedCollection;
	}

	get itemCollection()
	{
		return EmbedItemCollection.instance;
	}

	insert(data, cb)
	{
		if(!_.isString(data.itemId))
		{
			let ids = [];
			let id = null;
			_.map(data.itemId, (item) => {
				id = this.itemCollection.insert(item);
				if(id)
				{
					ids.push(id);
				}
			});

			data.itemId = ids;
		}

		return super.insert(data, cb);
	}
}

export {EmbedEntity};
export default EmbedEntity.getInstance();