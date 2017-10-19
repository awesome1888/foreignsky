export default class Security
{
    static OK = 200;
    static NOT_AUTHORIZED = 401;
    static FORBIDDEN = 403;

    static getUserGroupEntity()
    {
        throw new Error('Not implemented: static getUserGroupEntity()');
    }

    /**
     * Returns the HTTP code: 401, 403 or 200, depending on if the current user passes
     * the security restrictions or not.
     * @param user
     * @param rules
     * @returns {number}
     */

    static testUser(user, rules)
    {
        // console.dir('Test '+user.getId());
        // console.dir(rules);

        if (!_.isObjectNotEmpty(rules) && !_.isFunction(rules))
        {
            // no restrictions, free entrance
            return this.OK;
        }

        // security declaration object can be a custom callback
        if (_.isFunction(rules))
        {
            const fResult = rules(user);
            if (_.isBoolean(fResult))
            {
                return fResult ? this.OK : this.FORBIDDEN;
            }

            return fResult;
        }

        if (rules.needAuthorized && !user)
        {
            return this.NOT_AUTHORIZED;
        }

        let passed = true;

        if (_.isArrayNotEmpty(rules.group))
        {
            const groups = user.getGroupIds().map((id) => {
                return this.getUserGroupEntity().getCodeById(id);
            });

            // console.dir(groups);
            // console.dir(rules.group);

            if (!_.intersection(rules.group, groups).length)
            {
                passed = false;
            }
        }

        // more rules coming

        return passed ? this.OK : this.FORBIDDEN;
    }

    static testUserCurrent(rules)
    {
        return this.testUser(this.getUserEntity().get(), rules);
    }

    static getAdminCondition()
    {
        return {
            needAuthorized: true,
            group: ['A'],
        };
    }
}
