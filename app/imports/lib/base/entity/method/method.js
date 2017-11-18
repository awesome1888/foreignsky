import BaseMethod from '../../method/method.js';
import SecurityProvider from '../../../util/security/provider.js';

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

    static getBaseDeclaration(sp = null)
    {
        const e = this.getEntity();

        // todo: provide "name" key to specify the method name
        // todo: in the name key provide #ENTITY_NAME# placeholder, to be able to denote the full custom name of a method
        return {
            find: {
                body: 'find',
                security: sp ? sp.getMethodPolicy(e, 'find') : SecurityProvider.getOpenGatePolicy(),
            },
            getCount: {
                body: 'getCount',
                security: sp ? sp.getMethodPolicy(e, 'getCount') : SecurityProvider.getOpenGatePolicy(),
                name: '#ENTITY#.count.get',
            },
            save: {
                body: 'save',
                security: sp ? sp.getMethodPolicy(e, 'save') : SecurityProvider.getStandardPolicy(),
            },
            remove: {
                body: 'remove',
                security: sp ? sp.getMethodPolicy(e, 'remove') : SecurityProvider.getStandardPolicy(),
            },
        };
    }

    /**
     * Declare additional, entity-specific methods here
     * @returns {{}}
     */
    static getExtendedDeclaration(sp = null)
    {
        return {};
    }

    static declare(securityProvider = null)
    {
        const declaration = Object.assign(
            {},
            this.getBaseDeclaration(securityProvider),
            this.getExtendedDeclaration(securityProvider)
        );

        if (_.isObjectNotEmpty(declaration))
        {
            const named = {};
            _.forEach(declaration, (method, code) => {
                named[this.makeName(code, method)] = method;
            });
            
            super.declare(named);
        }
    }

    static makeName(code, parameters)
    {
        const cId = this.getEntity().getUniqueCode();

        if (_.isStringNotEmpty(parameters.name))
        {
            return parameters.name.replace(/#ENTITY#/g, cId).trim();
        }

        return `${cId}.${code}`;
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
