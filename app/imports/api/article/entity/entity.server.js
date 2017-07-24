import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Exposition from '../exposition/exposition.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

import Tag from '../../../api/article.tag/entity/entity.server.js'
import File from '../../../api/file/entity/entity.server.js';
import Embed from '../../../api/embed/entity/entity.server.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static getEntityMap()
    {
        return {
            tag: Tag,
            embed: Embed,
        };
    }

    static restrictExpositionGrapher(filters, options, userId)
    {
        filters.public = true;
    }

    static getExpositionController()
    {
        return Exposition;
    }

    static populateEmbedImages(items)
    {
        if (_.isArrayNotEmpty(items))
        {
            let ids = {};
            const bind = [];
            items.forEach((item) => {
                if (_.isArrayNotEmpty(item.embed))
                {
                    item.embed.forEach((eItem) => {

                        if (_.isArrayNotEmpty(eItem.item))
                        {
                            eItem.item.forEach((eiItem) => {
                                if (_.isStringNotEmpty(eiItem.imageId))
                                {
                                    ids[eiItem.imageId] = true;
                                    bind.push(eiItem);
                                }
                            });
                        }

                    });
                }
            });

            ids = Object.keys(ids);
            if (_.isArrayNotEmpty(ids))
            {
                const fIndex = _.makeMap(File.getCollection().find({_id: {$in: ids}}).fetch(), '_id');
                bind.forEach((item) => {
                    item.image = null;
                    if (item.imageId in fIndex)
                    {
                        item.image = fIndex[item.imageId];
                    }
                });
            }
        }
    }
}
