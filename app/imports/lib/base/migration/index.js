// import {log} from '../../util/shell/shell.js';
import Side from './../../util/side.js';

Side.ensureOnServer();

/**
 * @abstract
 */
export default class BaseMigration
{
    getVersion()
    {
        throw new Error('Not implemented: getVersion()');
    }

    getName()
    {
        return 'New migration';
    }

    up()
    {
    }

    execute()
    {
        let failed = false;
        try
        {
            this.up();
        }
        catch(e)
        {
            failed = true;
            console.dir(e);
            // this.saveLogItem(Shell.console.getData(), e);
        }

        // if (!failed) {
        //     this.saveLogItem(Shell.console.getData());
        // }
    }

    // log()
    // {
    //     log.apply(this, arguments);
    // }

    transformItems(collection, parameters, actions, dryRun = false, noValidation = false)
    {
        if (!_.isArrayNotEmpty(actions))
        {
            return;
        }

        // this.log(`Transform items of "${collection._name}"${dryRun ? ' [DRY RUN]' : ''}`);

        // todo: remove grapher out of here
        collection.createQuery(parameters).fetch().forEach((item) => {
            const data = {};

            actions.forEach((action) => {
                if (_.isFunction(action))
                {
                    action.apply(this, [item, data]);
                }
            });

            if (_.isObjectNotEmpty(data))
            {
                if (!dryRun)
                {
                    // this.log(`Update ${item._id}`);
                    try
                    {
                        collection.update({_id: item._id}, {$set: data}, {bypassCollection2: noValidation});
                    }
                    catch (e)
                    {
                        // this.log(`While updating ${item._id} we encountered a error:`);
                        // this.log(e);
                    }
                }
                else
                {
                    // this.log(data);
                }
            }
        });
    }
}
