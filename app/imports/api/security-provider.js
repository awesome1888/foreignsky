import BaseSecurityProvider from '../lib/util/security/provider.js';

export default class SecurityProvider extends BaseSecurityProvider
{
    getMethodPolicy(entity, method)
    {
        // allow only find() and getCount(), reject all the rest
        if (method !== 'find' && method !== 'getCount')
        {
            return this.constructor.getConcreteWallPolicy();
        }

        return this.constructor.getOpenGatePolicy();
    }
}
