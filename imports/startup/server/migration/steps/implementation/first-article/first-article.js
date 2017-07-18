import File from '../../../../../../api/file/entity/entity.server.js';
import Embed from '../../../../../../api/embed/entity/entity.server.js';
import ArticleTag from '../../../../../../api/article.tag/entity/entity.server.js';
import BaseMigration from '../../../../../../lib/base/migration/migration.js';
import Util from '../../../../../../lib/util.js';
import Article from '../../../../../../api/article/entity/entity.server.js';

const fs = Npm.require('fs');

export default class FirstArticle extends BaseMigration
{
    _fileCache = {};
    embeds = [];
    text = '';

    constructor()
    {
        super();
        //this.up = this.up.bind(this);
    }

    get version()
    {
        return 1;
    }
    up()
    {
        this.clear();
        File.collection.remove({});
        Embed.collection.remove({});
        this.addFiles();
        this.addEmbeds();

        // add or update article
        //this.log(this.text);

        console.dir(ArticleTag.getByTitle(['событие', 'место', 'шопинг']));
        
        const data = {
            title: 'Блошиный рынок в Mauerpark',
            embedId: this.embeds,
            text: this.text,
            search: this.text.toUpperCase(),
            headerImageId: this.getFileId('dsc_0715.jpg'),
            tagId: _.pluck(ArticleTag.getByTitle(['событие', 'место', 'шопинг']), '_id'),
            //date: moment("20170512", "YYYYMMDD"),
        };

        let id;
        if(Article.collection.findOne({_id: 'niGF3h8FCQcCpndZb'}))
        {
            id = 'niGF3h8FCQcCpndZb';
            Article.collection.update({
                _id: id,
            }, {
                $set: data,
            });
        }
        else
        {
            id = Article.collection.insert(data);
        }

        if(id)
        {
            this.log('Created '+id);
        }
    }

    clear()
    {
        this.text = this.getText();
        this.embeds = [];
        this._fileCache = {};
    }

    addEmbeds()
    {
        this.addEmbed('GALLERY', [
            {label: 'Надеюсь, мистер песчаный человек хотя бы подмел за собой :)', file: 'DSC_0668'},
            {
                label: 'Я не поленился поискать в инете, и нашел его: https://www.facebook.com/theloneousarmadillo/',
                file: 'DSC_0686',
                options: [
                    {key: 'previewVerticalAlign', value: '-50px',},
                ],
            },
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Я сначала стеснялся фотографировать, поэтому сначала делал кадры скрытно :) (ну ладно, пытался скрытно)', file: 'DSC_0691'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Фотографию этой барышни я робко заполучил, купив у нее два магнита на холодильник. Да-да, не позволила совесть совсем нахаляву сфоткать :)', file: 'DSC_0699'},
        ]);

        this.addEmbed('GALLERY', [
            {file: 'DSC_0719'},
            {file: 'DSC_0720'},
        ]);

        this.addEmbed('GALLERY', [
            {label: 'Очаровательные арты. Милашки. Повесить пару таких над кроватью, чтобы спалось лучше :)', file: 'DSC_0734'},
            {
                label: 'Леди торгует разноцветными эмалированными чашками. Почему нет?:)',
                file: 'DSC_0693',
                options: [
                    {key: 'previewVerticalAlign', value: '-105px',},
                ],
            },
        ]);

        this.addEmbed('GALLERY', [
            {
                label: 'Очень трогательно и по-берлински.',
                file: 'DSC_0743',
                options: [
                    {key: 'previewVerticalAlign', value: '-17px',},
                ],
            },
            {
                label: 'Неполиткорретные сумки для походов в магазин за продуктами.',
                file: 'DSC_0740',
                options: [
                    {key: 'previewVerticalAlign', value: '-109px',},
                ],
            },
        ]);

        this.addEmbed('IMAGE', [
            {label: 'За границей рынка справа находится Max-Schmeling-Halle (спорткомплекс имени Макса Шмеллинга).', file: 'DSC_0729'},
        ]);

        this.addEmbed('GALLERY', [
            {
                label: 'Я насчитал несколько палаток, торгующих старыми наборами LEGO',
                file: 'DSC_0778',
                options: [
                    {key: 'previewVerticalAlign', value: '-244px',},
                ],
            },
            {file: 'DSC_0706'},
        ]);

        this.addEmbed('IMAGE', [
            {
                label: 'Вот они - вещи, привезенные неизвестно откуда.',
                file: 'DSC_0746',
                options: [
                    {key: 'previewVerticalAlign', value: '-565px',},
                ],
            },
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Вызывающий подозрение байк', file: 'DSC_0749'},
        ]);

        this.addEmbed('GALLERY', [
            {label: 'По рынку достаточно много отделов с винилом', file: 'DSC_0718'},
            {file: 'DSC_0882'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Знаю я этот фаст-фуд на солнцепеке', file: 'DSC_0768'},
        ]);

        this.addEmbed('GALLERY', [
            {
                label: 'Такая вот развлекательная программа.',
                file: 'DSC_0775',
                options: [
                    {key: 'previewVerticalAlign', value: '-137px',},
                ],
            },
            {
                label: 'И еще присутствует развлекательная программа, совмещенная с продажей.',
                file: 'DSC_0765',
                options: [
                    {key: 'previewVerticalAlign', value: '-200px',},
                ],
            },
        ]);

        this.addEmbed('GALLERY', [
            {label: '', file: 'DSC_0796'},
            {
                label: 'Но иногда все же попадается интересное',
                file: 'DSC_0759',
                options: [
                    {key: 'previewVerticalAlign', value: '-106px',},
                ],
            },
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Тут уже нет палаток, как таковых, а вместо них - ряды коробок и столов', file: 'DSC_0782'},
        ]);

        this.addEmbed('GALLERY', [
            {label: 'Я не мог пройти мимо сисек, простите.', file: 'DSC_0785'},
            {label: 'В ассортименте представлены старые игрушечные машинки.', file: 'DSC_0790'},
            {label: 'Небольшой такой билет в детство, если у вас были такие.', file: 'DSC_0836'},
            {label: 'Также очень много по тематике ГДР: это и ордена, и медали, и флаги, и монеты.', file: 'DSC_0780'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Монеты. Моря монет.', file: 'DSC_0812'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Очень много старой техники: видеокамеры, видемагнитофоны, фотоаппараты позапрошлого десятилетия.', file: 'DSC_0803'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Тут я уже начинаю наглеть', file: 'DSC_0817'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'Шах и мат, владельцы ссаных тряпок', file: 'DSC_0905'},
        ]);

        this.addEmbed('IMAGE', [
            {file: 'DSC_0887'},
        ]);

        this.addEmbed('IMAGE', [
            {label: 'В изобилии представлена посуда.', file: 'DSC_0820'},
        ]);

        this.addEmbed('GALLERY', [
            {label: 'Попадаются и практичные вещи, вроде армейских касок, которые могут пригодиться в быту :)', file: 'DSC_0801'},
            {label: 'Или, например, коллекция "калекокряков" из Властелина Колец. Между прочим, олово, а не пластмасса какая-нибудь.', file: 'DSC_0848'},
        ]);

        this.addEmbed('GALLERY', [
            {label: 'Также попадаются мрачные вещицы, вроде фрагментов тел животных.', file: 'DSC_0923'},
            {label: 'Скелет кошки, потрепанный временем.', file: 'DSC_0870'},
        ]);

        this.addEmbed('IMAGE', [
            {
                label: 'Старые фотографии посторонних людей, начало 19 века.',
                file: 'DSC_0835',
                options: [
                    {key: 'previewVerticalAlign', value: '-625px',},
                ],
            },
        ]);

        this.addEmbed('GALLERY', [
            {label: 'Просто до кучи: разные жестяные коробочки из-под разного.', file: 'DSC_0852'},
            {label: '', file: 'DSC_0854'},
        ]);

        this.addEmbed('IMAGE', [
            {
                label: 'Открытки. Моря их.',
                file: 'DSC_0858',
                options: [
                    {key: 'previewVerticalAlign', value: '-225px',},
                ],
            },
        ]);

        this.addEmbed('GALLERY', [
            {label: '"Сделки только за евро, джедай! Никаких Республиканских Кредитов, тут нужно что-то понадежнее." Хехе...', file: 'DSC_0869'},
            {label: 'Семейство деревянных котов смотрит на потенциального покупателя.', file: 'DSC_0898'},
            {label: 'И снова моря, на этот раз - значков.', file: 'DSC_0878'},
            {label: 'Куклы. (Мама, тебе это понравится!)', file: 'DSC_0900'},
        ]);

        this.addEmbed('IMAGE', [
            {
                label: 'Фото-ружжо и флаг ГДР. Опять ГДР. Всегда ГДР.',
                file: 'DSC_0866',
                options: [
                    {key: 'previewVerticalAlign', value: '-5px',},
                ],
            },
        ]);

        this.addEmbed('GALLERY', [
            {file: 'DSC_0892'},
            {file: 'DSC_0919'},
            {file: 'DSC_0818'},
            {file: 'DSC_0828'},
        ]);

        this.addEmbed('IMAGE', [
            {
                label: '',
                file: 'DSC_0881',
                options: [
                    {key: 'previewVerticalAlign', value: '-420px',},
                ],
            },
        ]);

        this.addEmbed('IMAGE', [
            {
                label: '',
                file: 'DSC_0929',
                options: [
                    {key: 'previewVerticalAlign', value: '-232px',},
                ],
            },
        ]);
    }

    addEmbed(type, items)
    {
        const itemsIds = [];
        items.forEach((item) => {
            item.imageId = this.getFileId(item.file.toLowerCase()+'.jpg');
            delete item.file;
        });

        const id = Embed.create(type, {
            items
        });

        this.embeds.push(id);
        this.setEmbedInText(id);
    }

    setEmbedInText(id)
    {
        const offset = this.embeds.length;
        this.text = this.text.replace(new RegExp('_'+offset+'_', 'mg'), '[EMBED ID='+this.embeds[offset - 1]+']');
    }

    getFileId(name)
    {
        return this._fileCache[name];
    }

    addFiles(files)
    {
        const pubFolder = 'mauer/2kx2k/';
        const imgFolder = File.localFolderAbsolute+pubFolder;
        //const folder300 = imgFolder+'300x300/';

        fs.readdirSync(imgFolder).forEach((item) => {
            const path = File.localFolder+pubFolder+item;
            const name = item;
            const id = File.collection.insert({
                path,
                name,
            });
            this._fileCache[item.toLowerCase()] = id;
        });
    }

    getText() {
        const pPath = Util.assetFolder + 'text.txt';
        this.log(pPath);
        return fs.readFileSync(pPath).toString();
    }
}



