import Side from './util/side.js';

Side.ensureOnClient();

export default class Crawler
{
    /**
     * Tell pre-render that page is ready
     */
    static setReady()
    {
        // tell crawler we are ready (it will catch the console output)
        // DO NOT modify this message, crawler wont able to decode it otherwise
        console.log('CRAWLER_PAGE_READY');
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
