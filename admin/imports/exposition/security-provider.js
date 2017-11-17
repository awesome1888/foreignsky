import BaseSecurityProvider from '../lib/util/security/provider.js';

export default class SecurityProvider extends BaseSecurityProvider
{
    getMethodPolicy(entity, method)
    {
        return this.constructor.getAdminOnlyPolicy();
    }
}

export const provider = new SecurityProvider();
