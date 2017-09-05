import {Meteor} from 'meteor/meteor';
import SpyConsole from './spy-console/spy-console.js';
import '../../underscore-mixin.js';

const writeFile = require('fs').writeFile;
const env = require('process').env;

const ShellClass = class Shell {
    static _cache = {};

    static isUnsafe = false; // carefully with that

    static register(jobId, name, action) {
        if(!Shell.isUnsafe)
        {
            if (!Meteor.isServer) {
                console.error('Unable register on client');
                return;
            }

            if (!Meteor.isDevelopment) {
                return; // do not use on production ever
            }
        }

        if (_.isFunction(name) && action === undefined) {
            action = name;
        }

        if (!_.isString(name)) {
            name = '';
        }

        if (!_.isStringNotEmpty(jobId) || !_.isFunction(action)) {
            throw new Meteor.Error('Invalid arguments');
        }

        if (!this.methodRegistered) {
            Meteor.methods({
                'shell.execute': this.execute,
                'shell.registration.list': this.registrationGetList.bind(this),
            });
            this.methodRegistered = true;
        }

        if (!this.jobs) {
            this.jobs = {};
        }

        this.jobs[jobId.trim()] = {
            action,
            name,
        };
    }

    static registrationGetList() {
        return {
            jobs: this.jobs,
        };
    }

    static execute(jobId) {

        if(!Shell.isUnsafe)
        {
            if (!Meteor.isDevelopment) {
                console.error('Not available on production');
                return {};
            }
        }

        if (
            !Shell.jobs ||
            !_.isObject(Shell.jobs[jobId]) ||
            !_.isFunction(Shell.jobs[jobId].action)
        ) {
            throw new Meteor.Error('Unknown job');
        }

        Shell._cache = {};

        try {
            Shell.startTime('MAIN');
            Shell.jobs[jobId].action.apply(Shell, [this]);
        } catch (e) {
            if (e instanceof Error) {
                Shell.getConsole().dir(e.stack);
            }
            else
            {
                Shell.getConsole().log(e.message);
            }
        }

        Shell.stopTime('MAIN');

        return {
            data: Shell.getConsole().getData(),
            durations: Shell.getDurations(),
            times: Shell.getTimes(),
            duration: Shell.getDuration(),
        };
    }

    static toSeconds(value) {
        return (value / 1000).toFixed(2);
    }

    static getConsole() {
        return SpyConsole.getInstance();
    }

    static dir(...args) {
        this.getConsole().dir(...args);
    }

    static startTime(label) {
        if (!this._cache.measures) {
            this._cache.measures = {};
        }
        if (!(label in this._cache.measures)) {
            this._cache.measures[label] = {
                total: 0,
                label,
            };
        }

        this._cache.measures[label].now = Date.now();
    }

    static stopTime(label) {
        if (!this._cache.measures || !(label in this._cache.measures)) {
            return;
        }
        this._cache.measures[label].total += Date.now() - this._cache.measures[label].now;
    }

    static getDuration() {
        return Shell.toSeconds(Shell._cache.measures.MAIN.total);
    }

    static getDurations() {
        const m = this._cache.measures || {};
        return Object
            .values(m)
            .filter(item => (item.total > 0 && item.label !== 'MAIN'))
            .map(item => ({
                total: this.toSeconds(item.total),
                label: item.label,
            }));
    }

    static times(label, inc = 1) {
        if (!this._cache.times) {
            this._cache.times = {};
        }
        if (!(label in this._cache.times)) {
            this._cache.times[label] = {
                label,
                count: 0,
            };
        }

        this._cache.times[label].count += inc;
    }

    static getTimes() {
        return this._cache.times;
    }

    static writeDebug(data) {
        const folder = env.PWD;
        writeFile(`${folder}/debug.txt`, data, (err) => {
            Shell.dir('Error');
            Shell.dir(err);
        });
    }
};

export default ShellClass;
export function log(...args) {
    return ShellClass.dir(...args);
}
export function start(label) {
    return ShellClass.startTime(label);
}
export function stop(label) {
    return ShellClass.stopTime(label);
}
export function times(label, inc = 1) {
    return ShellClass.times(label, inc);
}
