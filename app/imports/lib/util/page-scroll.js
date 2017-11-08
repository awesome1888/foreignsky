import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

/**
 * This class allows to manage the vertical scroll of the page
 */
export default class PageScroll
{
    /**
     * Store page scroll value
     * @returns void
     */
    static store()
    {
        if (Meteor.isClient)
        {
            const doc = document.documentElement;
            const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            Session.set('whereToScroll', top);
        }
    }

    /**
     * Resets the stored value of scroll
     * @returns void
     */
    static clear()
    {
        Session.set('whereToScroll', 0);
    }

    /**
     * Scroll to the stored page scroll value
     * @returns void
     */
    static scrollToStored(speed = 0)
    {
        if (Meteor.isClient)
        {
            const top = parseInt(Session.get('whereToScroll'), 10);
            if (!isNaN(top) && top >= 0)
            {
                this.scrollTo(top, speed);
                this.clear();
            }
        }
    }

    /**
     * Scroll to a specific value
     * @param {int} top
     * @param {int|string} duration
     * @returns void
     */
    static scrollTo(top = 0, duration = 0)
    {
        if (Meteor.isClient)
        {
            let t = parseInt(top, 10);
            if (isNaN(t) || t < 0)
            {
                t = 0;
            }
            if (!isNaN(duration))
            {
                $('html, body').animate({scrollTop: t}, duration);
                $('.modal').animate({scrollTop: t}, duration);
            }
            else
            {
                $('html, body').animate({scrollTop: t}, 0);
                $('.modal').animate({scrollTop: t}, 0);
            }
        }
    }
}
