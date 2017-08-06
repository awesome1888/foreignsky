import Exposition from '../../../lib/base/exposition/exposition.js';

export default class extends Exposition
{
    accessControl(op, parameters)
    {
        if (op === 'find' || op === 'count')
        {
            const condition = parameters[0];

            if (!_.isObject(condition))
            {
                this.getErrorEmitter().throw400('No condition defined');
            }

            if (!('filter' in condition))
            {
                condition.filter = {};
            }

            condition.filter.public = true;
        }
    }

    find(parameters)
    {
        const result = super.find(parameters);

        // getting images...
        if(_.getValue(parameters, 'select.embed.item.image') === 1)
        {
            this.entity.populateEmbedImages(result);
        }

        return result;
    }
}
