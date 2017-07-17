import {Component} from 'react';
import {Meteor} from 'meteor/meteor';

import App from '../../../ui/app.jsx';

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
        if (this._titleUpdated) {
            App.instance.setTitle();
            this._titleUpdated = false;
        }

        // un-bind events
        if (_.isArrayNotEmpty(this.events)) {
            this.events.forEach((pair) => {
                $(document).unbind(pair.event, pair.cb);
            });
        }
    }

    setTitle(title = '') {
        App.instance.setTitle(title);
        this._titleUpdated = true;
    }

    execute(name, args) {
        return new Promise((fulfil, reject) => {
            Meteor.apply(name, args, (err, res) => {
                if (err) {
                    this.showConsoleError(
                        `Error invoking Method '${name}': `,
                        err
                    );
                    reject(err);
                } else {
                    fulfil(res);
                }
            });
        });
    }

    showConsoleError(...args) {
        if (Meteor.isDevelopment) {
            // eslint-disable-next-line no-console
            console.error.apply(this, args);
        }
    }

    on(event, cb) {
        $(document).on(event, cb);
        this.events.push({
            event,
            cb,
        });
    }

    fire(event, args = []) {
        $(document).trigger(event, args);
    }
}
