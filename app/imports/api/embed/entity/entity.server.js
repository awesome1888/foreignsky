import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';

export default class Embed extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    // todo: actually, there should be "save", non-static
    static create(renderer, data)
    {
        // const itemId = [];
        // if(_.isArrayNotEmpty(data.items))
        // {
        //     // untested
        //     let order = 0;
        //     data.items.forEach((item) => {
        //         item.options = item.options || [];
        //         item.options.push({
        //             key: 'order', value: order,
        //         });
        //         const id = this.itemCollection.insert(item);
        //         if(id)
        //         {
        //             itemId.push(id);
        //         }
        //
        //         order += 1;
        //     });
        // }
        //
        // data.renderer = renderer;
        //
        // return this.getCollection().insert({
        //     renderer,
        //     itemId,
        // });
    }
}
