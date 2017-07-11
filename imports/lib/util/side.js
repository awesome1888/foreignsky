export default class Side
{
    static ensureClient()
    {
        if(!Meteor.isClient)
        {
            throw new Error('Can not invoke on server side');
        }
    }

    static ensureServer()
    {
        if(!Meteor.isServer)
        {
            throw new Error('Can not invoke on client side');
        }
    }
}
