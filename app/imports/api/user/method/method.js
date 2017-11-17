import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';
import SecurityProvider from '../../../lib/util/security/provider.js';
import Security from '../../../lib/util/security/security.server.js';

export default class extends Method
{
    static getEntity()
    {
        return Entity;
    }

    static getExtendedDeclaration(sp = null)
    {
        return {
            'token.get': {
                body: 'getToken',
                security: SecurityProvider.getAdminOnlyPolicy(),
            },
            'articleDraft.token.get': {
                body: 'getArticleDraftToken',
                security: SecurityProvider.getAdminOnlyPolicy(),
            },
        };
    }

    getToken()
    {
        return Security.getToken();
    }

    getArticleDraftToken()
    {
        
    }
}
