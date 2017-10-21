import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';

import SecurityProvider from '../../../lib/util/security/provider.js';

export default class extends Method
{
    static getEntity()
    {
        return Entity;
    }

    static getExtendedDeclaration(sp = null)
    {
        return {
            getCodeMap: {
                body: 'getCodeMap',
                security: SecurityProvider.getOpenGatePolicy(),
            },
        };
    }

    getCodeMap()
    {
        const result = {};
        this.getEntity().find({select: ['code']}, {returnArray: true}).forEach((item) => {
            result[item._id] = item.code;
        });

        return result;
    }
}
