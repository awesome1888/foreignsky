import BaseMethod from '../../api/user/method/method.js';
import SecurityProvider from '../../lib/util/security/provider.js';
import Security from '../../lib/util/security/security.server.js';

export default class Method extends BaseMethod
{
    static getExtendedDeclaration(sp = null)
    {
        return {
            'token.get': {
                body: 'getToken',
                security: SecurityProvider.getAdminOnlyPolicy(),
            },
        };
    }

    getToken()
    {
        return Security.getToken();
    }
}
