import Collection from '../../../lib/base/collection/collection.js';
import ArticleTagCollection from '../../article.tag/config/collection.js';
import FileCollection from '../../file/config/collection.js';
import EmbedCollection from '../../embed/config/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('article');
    }

    getSchema()
    {
        return {
            title: {
                type: String,
                optional: false,
                label: 'Заголовок',
            },
            date: {
                type: Date,
                optional: false,
                label: 'Дата',
            },
            text: {
                type: String,
                optional: false,
                label: 'Текст',
            },
            tagId: {
                type: [String],
                optional: true,
                label: 'Теги',
            },
            location: {
                type: [Number],
                optional: true,
                label: 'Местоположение',
            },
            headerImageId: {
                type: String,
                optional: true,
            },
            search: {
                type: String,
                optional: false,
                label: 'Поисковый индекс',
            },
            embedId: {
                type: [String],
                optional: true,
                label: 'Изображения',
            },
            public: {
                type: Boolean,
                optional: true,
                defaultValue: false,
                label: 'Опубликовано',
            }
        };
    }

    getLinks()
    {
        return {
            tag: {
                type: 'many',
                collection: ArticleTagCollection,
                field: 'tagId',
                index: true,
            },
            headerImage: {
                type: 'one',
                collection: FileCollection,
                field: 'headerImageId',
                index: false,
            },
            embed: {
                type: 'many',
                collection: EmbedCollection,
                field: 'embedId',
                index: true,
            },
        };
    }

    getIndexes()
    {
        return [
            {
                fields: {
                    search: "text",
                },
                options: {
                    name: 'search',
                },
            }
        ];
    }

    applyHooks()
    {
        this.before.insert((id, data) => {
            // todo: update search
        });
        this.before.update((id, data) => {
            // todo: update search
        });
    }
}
