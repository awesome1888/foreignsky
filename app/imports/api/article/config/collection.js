import Collection from '../../../lib/base/collection/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('article');
    }

    // getIndexes()
    // {
    //     return [
    //         {
    //             fields: {
    //                 search: "text",
    //             },
    //             options: {
    //                 name: 'search',
    //             },
    //         }
    //     ];
    // }
    //
    // applyHooks()
    // {
    //     this.before.insert((id, data) => {
    //         // todo: update search
    //     });
    //     this.before.update((id, data) => {
    //         // todo: update search
    //     });
    // }
}
