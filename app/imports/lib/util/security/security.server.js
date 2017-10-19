import User from '../../../api/user/entity/entity.server.js';
import UserGroup from '../../../api/user.group/entity/entity.server.js';
import SecurityBoth from './security.both.js';
import Side from './../../util/side.js';

Side.ensureOnServer();

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
}
