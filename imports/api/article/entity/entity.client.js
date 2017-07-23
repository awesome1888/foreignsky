import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import moment from 'moment';
import File from '../../../api/file/entity/entity.client.js';
import Tag from '../../../api/article.tag/entity/entity.client.js';
import Embed from '../../../api/embed/entity/entity.client.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static get entityMap()
    {
        return {
            tag: Tag,
            embed: Embed,
        };
    }

    get renderedText()
    {
        return Embed.render(this.text, this.embed);
    }

    get dateFormatted()
    {
        const date = this.date;
        if (date !== null)
        {
            return moment(date).format('LL');
        }

        return '';
    }

    get headerImagePath()
    {
        if (this.hasHeaderImage())
        {
            return File.convertToUrl(this.headerImage.path || '');
        }

        return '';
    }
}
