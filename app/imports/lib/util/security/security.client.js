import User from '../../../api/user/entity/entity.client.js';
import UserGroup from '../../../api/user.group/entity/entity.client.js';
import SecurityBoth from './security.both.js';

import ConsoleOutput from '../console-output/index.js';

export default class Security extends SecurityBoth
{
    static getUserEntity()
    {
        return User;
    }

    static getUserGroupEntity()
    {
        return UserGroup;
    }

    static testUserCurrent(rules)
    {
        ConsoleOutput.dir('Checking page access...');

        return super.testUserCurrent(rules);
    }
}
