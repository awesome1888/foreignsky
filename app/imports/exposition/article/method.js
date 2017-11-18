import BaseMethod from '../../api/article/method/method.js';

export default class Method extends BaseMethod
{
    static getBaseDeclaration(sp = null)
    {
        return _.intersectKeys(super.getBaseDeclaration(sp), {
            find: 1,
            getCount: 1,
        });
    }
}
