import ErrorEmitter from '../../util/erroremitter.js';

export default class
{
    _entity = null;

    constructor(entity)
    {
        this._entity = entity;
        this.registerMethods();
    }

    getEntity()
    {
        return this._entity;
    }

    getMap()
    {
        return {
            'find': {
                body: this.find,
                // todo: the same restrictions as in any ordinary method in this cms:
                //     security: {
                //         needAuthorized: true,
                //         needAdmin: true,
                //         controller: () => {}
                //     }
            },
            'save': {
                body: this.save,
            },
            'delete': {
                body: this.delete,
            },
            'getCount': {
                body: this.getCount,
            },
        };
    }

    registerMethods()
    {
        const cId = this.getEntity().getCollection().getNameNormalized();
        const methods = {};
        _.forEach(this.getMap(), (desc, op) => {
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
        return this.getEntity().createQuery(parameters).fetch();
    }

    getCount(parameters)
    {
        const q = this.getEntity().createQuery(parameters);
        
        // due to some fucking reason we dont have getCount() in Query
        // on server-side anymore 0_o
        // so, have to emulate (taken directly from grapher`s code on github)

        return this.getEntity().getCollection().find(q.body.$filters || {}, {}).count();
    }

    save(id, data)
    {
        console.dir(id);
        console.dir(data);
    }

    delete(id)
    {
        // todo
    }

    accessControl(op, parameters)
    {
        return true;
    }

    getErrorEmitter()
    {
        return ErrorEmitter;
    }
}
