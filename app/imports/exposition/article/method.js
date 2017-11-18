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

    static getExtendedDeclaration(sp = null)
    {
        return {
            getDraftToken: {
                name: '#ENTITY#.draftToken.get',
                body: 'getDraftToken',
                security: sp,
            },
        };
    }

    getDraftToken()
    {
        // todo: move to options
        return 'fTKZuZYaEoetGkotd7EbQMokXQJZwg';
    }
}
