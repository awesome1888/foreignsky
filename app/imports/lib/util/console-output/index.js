export default class ConsoleOutput
{
    static dir(...args)
    {
        if (Meteor.isDevelopment)
        {
            console.dir(...args);
        }
    }
}
