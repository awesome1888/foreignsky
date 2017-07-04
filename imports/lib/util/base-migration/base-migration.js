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
}
