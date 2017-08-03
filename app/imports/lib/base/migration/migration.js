import {log} from '../../util/shell/shell.js';

if (!Meteor.isServer)
{
    throw new Error('Not a server');
}

/**
 * @abstract
 */
export default class BaseMigration
{
    get version()
    {
        throw new Error('Not implemented');
    }

    get name()
    {
        return 'Another migration';
    }

    up()
    {
        throw new Error('Not implemented');
    }

    down()
    {
    }

    log()
    {
        log.apply(this, arguments);
    }

    transformItems(collection, filter, actions)
    {
        if (!_.isArrayNotEmpty(actions))
        {
            return;
        }
        collection.find(filter).forEach((item) => {
            const data = {};

            actions.forEach((action) => {
                if (_.isFunction(action))
                {
                    action.apply(this, [item, data]);
                }
            });

            if (_.isObjectNotEmpty(data))
            {
                this.log(data);
                collection.update({_id: item._id}, {$set: data});
            }
        });
    }
}
