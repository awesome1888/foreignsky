import User from '../../../../api/user/entity/entity.server.js';
import UserGroup from '../../../../api/user.group/entity/entity.server.js';

// create admin group
let aGroupId = null;
const aGroup = UserGroup.findOne({
    filter: {code: 'A'},
});
if (!aGroup)
{
    const res = UserGroup.save(null, {
        code: 'A',
        name: 'Administrators',
    });
    if (res)
    {
        aGroupId = res;
    }
    else
    {
        console.dir('Unable to create the group of administrators');
    }
}
else
{
    aGroupId = aGroup.getId();
}

// create admin user
if (aGroupId)
{
    const aUser = User.findOne({
        filter: {groupId: aGroupId},
    });

    if (!aUser)
    {
        if(!User.save(null, {
            email: 'admin@nachberlin.ru',
            password: '123', // chage later!!!
            groupId: [aGroupId],
            profile: {
                firstName: 'Fat',
                lastName: 'Admin',
            },
        }))
        {
            console.dir('Unable to create an administrator');
        }
    }
}
