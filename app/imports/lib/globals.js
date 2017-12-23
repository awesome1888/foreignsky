export default class Globals
{
    static getApplicationId()
    {
        return Meteor.settings.public.appId || null;
    }
}
