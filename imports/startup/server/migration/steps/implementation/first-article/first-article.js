import File, {FileEntity} from '../../../../../../api/entity/file.js';
import {EmbedEntity as Embed, default as EMBED__} from '../../../../../../api/entity/embed.js';
import BaseMigration from '../../../../../../lib/util/base-migration/base-migration.js';
import Util from '../../../../../../lib/util.js';
import ArticleCollection from '../../../../../../api/collection/article.js';

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
        EMBED__.collection.remove({});
        Embed.itemCollection.remove({});
        this.addFiles();
        this.addEmbeds();

        // add or update article
        //this.log(this.text);

        // todo: implement add
        const res = ArticleCollection.instance.update({
            _id: 'niGF3h8FCQcCpndZb',
        }, {
            $set: {
                embedId: this.embeds,
                text: this.text,
                search: this.text.toUpperCase(),
            },
        });

        this.log(res);
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
            {label: 'Я не поленился поискать в инете, и нашел его: https://www.facebook.com/theloneousarmadillo/', file: 'DSC_0686'},
        ]);
    }

    addEmbed(type, items)
    {
        const itemsIds = [];
        items.forEach((item) => {
            item.imageId = this.getFileId(item.file.toLowerCase()+'.jpg');
            delete item.file;
        });

        const id = Embed.add(type, {
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
        const imgFolder = FileEntity.localFolderAbsolute+pubFolder;
        //const folder300 = imgFolder+'300x300/';

        fs.readdirSync(imgFolder).forEach((item) => {
            const path = FileEntity.localFolder+pubFolder+item;
            const name = item;
            const id = File.collection.insert({
                path,
                name,
            });
            this._fileCache[item.toLowerCase()] = id;
        });
    }

    getText() {
        const pPath = Util.getProjectFolder() + 'imports/startup/server/migration/steps/implementation/first-article/text.txt';
        return fs.readFileSync(pPath).toString();
    }
}



