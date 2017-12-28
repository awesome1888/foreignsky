import Side from './util/side.js';

Side.ensureOnClient();

export default class Crawler
{
    /**
     * Tell pre-render that page is ready
     */
    static setReady()
    {
        // fire event!
    }

    /**
     * Returns true, if google/yandex/facebook or any other crawler is visiting the app at the moment
     * @returns {boolean}
     */
    static isCrawler()
    {
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
        return agent.indexOf('render-server') >= 0; // preprender crawler
    }
}
