import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';
import File from '../../../api/file/entity/entity.server.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static onBeforeSave(id, data)
    {
        // if text gets updated, update the search field too
        if (!('search' in data) && _.isStringNotEmpty(data.text))
        {
            data.search = data.text.toUpperCase();
        }
    }

    // a spike: special case for loading images, which grapher is unable to do
    /**
     * @param condition
     * @param parameters
     */
    static find(condition = {}, parameters = {})
    {
        const qResult = this.createQuery(condition).fetch();

        if (_.getValue(condition, 'select.embed.item.image') === 1)
        {
            // get images...
            this.populateImages(qResult);
        }
        
        if (parameters.returnArray === true)
        {
            return qResult;
        }

        return qResult.reduce((result, data) => {
            // make instance
            result.push(new this(data));
            return result;
        }, []);
    }

    /**
     * Temporal, dont use!
     *
     * @private
     * @param articles
     */
    static populateImages(articles)
    {
        // собираем embed всех статей, у каждой embed собираем картинку из item
        if (!articles.length)
        {
            return;
        }
        
        let ids = {};
        const attachTo = [];
        // damn it...
        articles.forEach((article) => {
            if (article.embed && article.embed.length)
            {
                article.embed.forEach((embed) => {
                    if (embed.item && embed.item.length)
                    {
                        embed.item.forEach((item) => {
                            if (_.isStringNotEmpty(item.imageId)) {
                                ids[item.imageId] = true;
                                attachTo.push(item);
                            }
                        });
                    }
                });
            }
        });

        ids = Object.keys(ids);

        if (_.isArrayNotEmpty(ids))
        {
            // todo: aggrrrhhh need "result collections" here instead of this crappy reduce
            const files = _.reduce(File.find({
                filter: {_id: {$in: ids}},
                select: ['url'],
            }, {returnArray: true}), (result, item) => {
                result[item._id] = item;
                return result;
            }, {});

            // put files on places...
            attachTo.forEach((item) => {
                if (_.isStringNotEmpty(item.imageId)) {
                    item.image = files[item.imageId];
                }
            });
        }
    }
}
