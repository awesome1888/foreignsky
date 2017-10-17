import User from '../../../api/user/entity/entity.client.js';
import UserGroup from '../../../api/user.group/entity/entity.client.js';

export default class Security
{
    /**
     * Returns the HTTP code: 401, 403 or 200. This function can be called ONLY after the user gets authorized
     * and all additional accounts data get loaded
     * @param rules
     * @returns {number}
     */
    static makeCode(rules)
    {
        if (!_.isObjectNotEmpty(rules))
        {
            // no restrictions so far
            return 200;
        }

        console.dir('Checking the access....');

        const user = User.get();
        if (!user)
        {
            // user not authorized
            return 401;
        }

        if (!this.check(user, rules))
        {
            // authorized, but forbidden
            return 403;
        }

        return 200;
    }

    /**
     * Checks if the given user passes the given set of rules
     * todo: perhaps move this code to security.both.js
     * @param user
     * @param rules
     */
    static check(user, rules)
    {
        let pass = true;

        if (_.isArrayNotEmpty(rules.group))
        {
            const groups = user.getGroupIds().map((id) => {
                return UserGroup.getCodeById(id);
            });

            // console.dir(groups);
            // console.dir(rules.group);

            if (!_.intersection(rules.group, groups).length)
            {
                pass = false;
            }
        }

        // more rules coming

        return pass;
    }
}
