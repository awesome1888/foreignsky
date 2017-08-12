export default class Side
{
    static ensureOnClient()
    {
        if(!Meteor.isClient)
        {
            throw new Error('Can not invoke on server side');
        }
    }

    static ensureOnServer()
    {
        if(!Meteor.isServer)
        {
            throw new Error('Can not invoke on client side');
        }
    }
}
