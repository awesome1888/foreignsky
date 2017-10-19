export default class SecurityProvider
{
    getMethodPolicy(entity, method)
    {
        return this.constructor.getStandardPolicy();
    }

    getRoutePolicy(route)
    {
        return this.constructor.getOpenGatePolicy();
    }

    /**
     * Admin policy, which prescripts to be an admin, high level of security clearance
     * @returns {{needAuthorized: boolean, group: [string]}}
     */
    static getAdminOnlyPolicy()
    {
        return {
            needAuthorized: true,
            group: ['A'],
        };
    }

    /**
     * Standard policy, which prescripts to be at least authorized
     * @returns {{needAuthorized: boolean}}
     */
    static getStandardPolicy()
    {
        return {
            needAuthorized: true,
        };
    }

    /**
     * The most open policy, tells not to check rights
     * @returns {null}
     */
    static getOpenGatePolicy()
    {
        return null;
    }
}
