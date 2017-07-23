import Collection from '../../../lib/base/collection/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('article.tag');
    }

    get schema()
    {
        return {
            title: {
                type: String,
                optional: false,
                label: 'Текст',
                // order: 1,
            },
            sort: {
                type: Number,
                optional: true,
                label: 'Сортировка',
                // order: 2,
            },
            color: {
                type: String,
                optional: true,
                regEx: /^[a-z0-9_-]+$/,
                label: 'Цвет',
                // order: 3,
            },
            primary: {
                type: Boolean,
                optional: true,
                label: 'Основной',
                // order: 4,
            },
            search: {
                type: String,
                optional: true,
                label: 'Поисковый индекс',
                // order: 5,
            },
        };
    }
}
