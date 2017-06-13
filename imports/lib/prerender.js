export default class PreRender
{
    /**
     * Tell pre-render to wait until page is ready
     */
    static lock()
    {
        if(Meteor.isClient)
        {
            window.prerenderReady = false;
        }
    }

    /**
     * Tell pre-render that page is ready
     */
    static unLock()
    {
        if(Meteor.isClient)
        {
            Meteor.setTimeout(() => {
                window.prerenderReady = true;
            }, 10000);
        }
    }

    /**
     * Returns true, if google/yandex is visiting the app at the moment
     * @returns {boolean}
     */
    static get isCrawler()
    {
        const ef = FlowRouter.getQueryParam('escaped_fragment');
        return ef !== undefined;
    }
}