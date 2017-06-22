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
     * Returns true, if google/yandex/prerender/... is visiting the app at the moment
     * @returns {boolean}
     */
    static get isCrawler()
    {
        return true;

        if(!Meteor.isClient)
        {
            return false;
        }

        const ef = FlowRouter.getQueryParam('_escaped_fragment_');
        if(ef !== undefined)
        {
            return true;
        }

        const agent = navigator.userAgent.toLowerCase();
        return agent.indexOf('prerender') >= 0; // preprender crawler
    }
}
