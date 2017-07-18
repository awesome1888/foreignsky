import Collection from '../../../lib/base/collection/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('file');
    }

    get schema()
    {
        return {
            name: {
                type: String,
                optional: false,
            },
            path: {
                type: String,
                optional: false,
            },
        };
    }
}
