import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import moment from 'moment';
import map from '../map/map.client.js';
import Embed from '../../../api/embed/entity/entity.client.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static getTitle()
    {
        return 'Article';
    }

    static getMapInstance()
    {
        return map;
    }

    renderText(renderer = {})
    {
        return Embed.render(this.getText(), this.getEmbed(), {
            renderer,
        });
    }

    getDateFormatted()
    {
        const date = this.getDate();
        if (date !== null)
        {
            return moment(date).format('LL');
        }

        return '';
    }

    getHeaderImageUrl(resizeTo = null)
    {
        if (this.hasHeaderImage())
        {
            return this.getHeaderImage().getAbsoluteUrlImage(resizeTo);
        }

        return '';
    }
}
