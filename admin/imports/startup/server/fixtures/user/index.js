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
        filter: {'profile.groupId': aGroupId},
    });

    if (!aUser)
    {
        if(!User.save(null, {
            email: 'admin@nachberlin.ru',
            password: '123', // change later!!!
            profile: {
                firstName: 'Fat',
                lastName: 'Admin',
                groupId: [aGroupId],
            },
        }))
        {
            console.dir('Unable to create an administrator');
        }
    }
}

const uUser = User.findOne({
    filter: {'emails.address': 'simple-mortal@nachberlin.ru'},
});
if (!uUser)
{
    if(!User.save(null, {
        email: 'simple-mortal@nachberlin.ru',
        password: '123', // change later!!!
        profile: {
            firstName: 'Simple',
            lastName: 'Mortal',
        },
    }))
    {
        console.dir('Unable to create a simple mortal');
    }
}
