import BaseMethod from '../../method/method.js';

export default class Method extends BaseMethod
{
    static getEntity()
    {
        throw new Error('Not implemented: static getEntity()');
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }

    static getBaseDeclaration()
    {
        return {
            find: {
                body: 'find',
                security: {
                    needAuthorized: false,
                }
            },
            getCount: {
                body: 'getCount',
                security: {
                    needAuthorized: false,
                }
            },
            save: {
                body: 'save',
            },
            remove: {
                body: 'remove',
            },
        };
    }

    /**
     * Declare additional, entity-specific methods here
     * @returns {{}}
     */
    static getExtendedDeclaration()
    {
        return {};
    }

    static declare()
    {
        const declaration = Object.assign({}, this.getBaseDeclaration(), this.getExtendedDeclaration());
        if (_.isObjectNotEmpty(declaration))
        {
            const named = {};
            _.forEach(declaration, (method, name) => {
                named[this.makeName(name)] = method;
            });

            super.declare(named);
        }
    }

    static makeName(name)
    {
        const cId = this.getEntity().getCollection().getNameNormalized();
        return `${cId}.${name}`;
    }

    find(parameters)
    {
        return this.getEntity().find(parameters, {returnArray: true});
    }

    getCount(filter)
    {
        // in the normal way it should be called like the following:
        // return this.getEntity().getCount(filter);

        // but...
        const entity = this.getEntity();
        const q = entity.createQuery(filter);

        // due to some fucking reason we dont have getCount() in Query
        // on server-side when calling withing the method 0_o
        // so, have to emulate (taken directly from grapher`s code on github)

        return entity.getCollection().find(q.body.$filters || {}, {}).count();
    }

    save(id, data)
    {
        return this.getEntity().save(id, data);
    }

    remove(filter)
    {
        return this.getEntity().remove(filter);
    }
}
