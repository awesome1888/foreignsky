import {Meteor} from 'meteor/meteor';
import Side from './../../util/side.js';

Side.ensureOnServer();

/**
 * @abstract
 */
export default class
{
    _invocationCtx = null;

    static declare(declaration) {
        if (_.isObjectNotEmpty(declaration)) {
            const methods = {};

            _.each(declaration, (desc, name) => {
                name = name.toString().trim();

                const bodyName = desc.body.toString().trim();
                if (!(bodyName in this.prototype)) {
                    throw new Error(`Body function ${bodyName}(){...} not implemented for method "${name}"`);
                }

                this.prepareSecurity(desc);

                // turn logging by default
                if (!('log' in desc)) {
                    desc.log = true;
                }

                methods[name] = this.makeImplementation(desc, name, bodyName);
            });

            Meteor.methods(methods);
        }
    }

    static makeImplementation(desc, name, bodyName) {
        const _method = this;

        return function Implementation() {
            // eslint-disable-next-line prefer-rest-params
            const _args = arguments;

            if (desc.security) {
                const s = desc.security;
                if (s.needAuthorized) {
                    // todo: implement this
                    // _method.security.checkIsLoggedIn();
                }
                if (s.needAdmin) {
                    // todo: implement this
                    // _method.security.checkAdmin();
                }
            }

            if (desc.log) {
                // todo: implement this
                // _method.logger.info(`Method ${name}`, {
                //     args: _args,
                //     userId: _method.getUserId(),
                // });
            }

            const context = new _method();
            context.setInvocationContext(this);

            let result;
            if (Meteor.isDevelopment) {
                // for develop - no throw-catch so we are able
                // to watch the error in the console
                result = context[bodyName](..._args);
            } else {
                // on production all errors go to log, and to client
                try {
                    result = context[bodyName](..._args);
                } catch (e) {
                    // todo: implement this
                    // Logger.error('Exception', {
                    //     userId: _method.getUserId(),
                    //     args: _.toString(_args),
                    //     message: e.message,
                    //     trace: e.stack,
                    // });
                    throw e;
                }
            }

            return result;
        };
    }

    static prepareSecurity(desc) {
        desc.security = desc.security || {};

        // turn on needAuthorized by default
        if (!('needAuthorized' in desc.security)) {
            desc.security.needAuthorized = true;
        }
    }

    setInvocationContext(ctx) {
        this._invocationCtx = ctx;
    }

    getInvocationContext() {
        return this._invocationCtx;
    }

    spawnInvocation(constructor) {
        const instance = new constructor();
        instance.setInvocationContext(this.getInvocationContext());

        return instance;
    }

    static getUserId() {
        return Meteor.user() ? Meteor.user()._id : '';
    }
}
