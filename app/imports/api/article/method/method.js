import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';

export default class extends Method
{
    static getEntity()
    {
        return Entity;
    }

    static getExtendedDeclaration(sp = null)
    {
        return {
            getDraftToken: {
                name: '#ENTITY#.draftToken.get',
                body: 'getDraftToken',
                security: null,
            },
        };
    }

    getDraftToken()
    {
        // todo: move to options
        return 'fTKZuZYaEoetGkotd7EbQMokXQJZwg';
    }
}
