import File from '../../../../../api/file/entity/entity.server.js';
import Embed from '../../../../../api/embed/entity/entity.server.js';
import BaseMigration from '../../../../../lib/base/migration/migration.js';
import Util from '../../../../../lib/util.js';
import Article from '../../../../../api/article/entity/entity.server.js';

export default class extends BaseMigration
{
    constructor()
    {
        super();
        //this.up = this.up.bind(this);
        this.itemcoll = new Mongo.Collection('embed.item');
    }

    get version()
    {
        return 2;
    }
    up()
    {

    }
}



