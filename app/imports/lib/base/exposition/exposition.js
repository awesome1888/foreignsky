import ErrorEmitter from '../../util/erroremitter.js';

export default class
{
    _entity = null;

    constructor(entity)
    {
        this._entity = entity;
        this.registerMethods();
    }

    get entity()
    {
        return this._entity;
    }

    get map()
    {
        return {
            'find': {
                body: this.find,
                //     security: {
                //         needAuthorized: true,
                //         needAdmin: true,
                //         controller: this.accessControl
                //     }
            },
        };
    }

    registerMethods()
    {
        const cId = this.entity.collection.nameNormalized;
        const methods = {};
        _.forEach(this.map, (desc, op) => {
            methods[`${cId}-${op}`] = this.makeMethodBody(op, desc);
        });

        Meteor.methods(methods);
    }

    makeMethodBody(op, desc)
    {
        return function(...args) {
            const security = desc.security || {};
            if (security.needAuthorized) {
                // check auth
            }
            if (security.needAdmin) {
                // check admin
            }
            const controller = _.isFunction(desc.controller) ? desc.controller : this.accessControl;
            if (controller.apply(this, [op, args]) === false)
            {
                // refactor later
                ErrorEmitter.throw403();
            }

            return desc.body.apply(this, args);
        }.bind(this);
    }

    find(parameters)
    {
        return this.entity.createQuery(parameters).fetch();
    }

    count(parameters)
    {
        // todo
    }

    save()
    {
        // todo
    }

    delete()
    {
        // todo
    }

    accessControl(op, parameters)
    {
    }
}
