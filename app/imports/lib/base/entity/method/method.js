import Method from '../../method/method.js';

export default class extends Method
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
        return this.getEntity().createQuery(parameters).fetch();
    }

    getCount(filter)
    {
        const q = this.getEntity().createQuery(filter);

        // due to some fucking reason we dont have getCount() in Query
        // on server-side anymore 0_o
        // so, have to emulate (taken directly from grapher`s code on github)

        return this.getEntity().getCollection().find(q.body.$filters || {}, {}).count();
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
