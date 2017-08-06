import {Meteor} from 'meteor/meteor';

export default class ErrorEmitter {
    /**
     * Throws 400 error
     */
    static throw400(message = '') {
        throw new Meteor.Error(
            '400',
            `Illegal arguments${(_.isStringNotEmpty(message) ? `: ${message}` : '')}`
        );
    }

    /**
     * Throws 401 error
     */
    static throw401() {
        throw new Meteor.Error('401', 'Not authorized');
    }

    /**
     * Throws 403 error
     */
    static throw403() {
        throw new Meteor.Error('403', 'Go away, hacker');
    }

    /**
     * Throws 404 error
     */
    static throw404(message) {
        throw new Meteor.Error('404', message || 'Entity not found');
    }

    /**
     * Throws 500 error
     */
    static throw500(message) {
        throw new Meteor.Error('500', message || 'Internal error occurred');
    }
}
