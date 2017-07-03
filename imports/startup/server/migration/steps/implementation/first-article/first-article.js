import File, {FileEntity} from '../../../../../../api/entity/file.js';
import {EmbedEntity as Embed, default as EMBED__} from '../../../../../../api/entity/embed.js';
import BaseMigration from '../../../../../../lib/util/base-migration/base-migration.js';

const fs = Npm.require('fs');

export default new (class extends BaseMigration {

    _fileCache = {};

    get version()
    {
        return 1;
    }
    up()
    {
        File.collection.remove({});
        EMBED__.collection.remove({});
        Embed.itemCollection.remove({});
        this.addFiles();
        this.addEmbeds();
    }

    addEmbeds()
    {
        let id = this.addEmbed('GALLERY', [
            {label: 'Надеюсь, мистер песчаный человек хотя бы подмел за собой :)', file: 'DSC_0668'},
            {label: 'Как выяснилось позже, это был https://www.facebook.com/theloneousarmadillo/', file: 'DSC_0686'},
        ]);
        log('>>> '+id);
    }

    addEmbed(type, items)
    {
        const itemsIds = [];
        items.forEach((item) => {
            item.imageId = this.getFileId(item.file.toLowerCase()+'.jpg');
            delete item.file;
        });

        log(items);

        return Embed.add(type, {
            items
        });
    }

    getFileId(name) {
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
        return "";
    }
})();


