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

	static get itemCollection()
    {
        return EmbedItemCollection.instance;
    }

	static add(renderer, data)
	{
        const itemId = [];
		if(_.isArrayNotEmpty(data.items))
		{
            data.items.forEach((item) => {
                const id = this.itemCollection.insert(item);
                if(id)
                {
                    itemId.unshift(id);
                }
            });
		}

		data.renderer = renderer;

		return EmbedCollection.instance.insert({
            renderer,
            itemId,
        });
	}
}

export {EmbedEntity};
export default EmbedEntity.getInstance();