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
		    let order = 0;
            data.items.forEach((item) => {
                item.options = item.options || [];
                item.options.push({
                    order
                });
                const id = this.itemCollection.insert(item);
                if(id)
                {
                    itemId.push(id);
                }

                order += 1;
            });
		}

		data.renderer = renderer;

		return EmbedCollection.instance.insert({
            renderer,
            itemId,
        });
	}

	static parseOptions(options)
    {
	    const result = {};

	    if(_.isArrayNotEmpty(options))
        {
            options.forEach((item) => {
                if (_.isObjectNotEmpty(item))
                {
                    result[item.key] = item.value;
                }
            });
        }

	    return result;
    }
}

export {EmbedEntity};
export default EmbedEntity.getInstance();