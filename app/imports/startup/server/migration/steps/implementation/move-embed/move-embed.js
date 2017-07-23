import Embed from '../../../../../../api/embed/entity/entity.server.js';
import BaseMigration from '../../../../../../lib/base/migration/migration.js';
import EmbedItem from './embed-item.js';

export default class extends BaseMigration
{
    get version()
    {
        return 2;
    }
    up()
    {
        const eItems = _.makeMap(EmbedItem.find().fetch(), '_id', true);

        Embed.find({
            select: ['itemId', 'renderer', 'options']
        }).forEach((item) => {
            const dataSet = {};
            const dataUnSet = {};

            // migrate itemId
            let itemIds = item.data.itemId;

            if(_.isArray(itemIds))
            {
                let changed = false;
                const newItems = [];
                itemIds.forEach((itemId) => {
                    this.log(itemId);
                   if (itemId in eItems)
                   {
                       newItems.push(eItems[itemId]);
                       changed = true;
                   }
                });

                if (changed)
                {
                    dataSet.item = newItems;
                    dataUnSet.itemId = '';
                }
            }

            if(_.isObjectNotEmpty(dataSet) || _.isObjectNotEmpty(dataUnSet))
            {
               // update
                Embed.collection.update({
                    _id: item.id,
                }, {
                    $set: dataSet,
                    // $unset: dataUnSet,
                });
            }
        });
    }
}
