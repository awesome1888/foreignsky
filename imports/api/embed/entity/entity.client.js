import React from 'react';
import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

import EmbedImageComponent from '../../../ui/component/general/embed-image/index.jsx';
import EmbedGalleryComponent from '../../../ui/component/general/embed-gallery/index.jsx';

export default class Embed extends mix(BaseEntity).with(Entity)
{
    static render(text, data)
    {
        if (text !== '')
        {
            return '';

            if(!_.isString(text))
            {
                return '';
            }

            const expr = new RegExp('\\[EMBED\\s+ID=([a-zA-Z0-9]+)\\]', 'ig');
            let found;
            let parts = [];
            let prevIndex = 0;
            let chunk = '';
            while(found = expr.exec(text))
            {
                const till = expr.lastIndex - found[0].length;
                chunk = text.substr(prevIndex, till - prevIndex);

                if(chunk.length)
                {
                    parts.push(React.createElement('div', {key: prevIndex}, chunk));
                }

                parts.push(this.makeEmbed(found[1]));

                prevIndex = expr.lastIndex;
            }

            // when nothing were found or for the last part of the text
            chunk = text.substr(prevIndex, text.length - prevIndex);
            if(chunk.length)
            {
                parts.push(React.createElement('div', {key: chunk}, chunk));
            }

            return parts;
        }

        return text;
    }

    /**
     * @access protected
     * @param id Embed ID found in body
     * @returns {null}
     */
    static makeEmbed(id)
    {
        const data = this.data;

        id = id.toString().trim();
        if(!id)
        {
            return null;
        }

        // search for
        const embedData = data.embed.find((item) => {return item._id === id});
        if(!_.isObject(embedData))
        {
            return null;
        }

        const renderer = this.getRendererClass(embedData.renderer);
        if(!renderer)
        {
            return null;
        }

        return React.createElement(renderer, {
            key: id,
            item: embedData.item,
            options: embedData.options,
        });
    }

    /**
     * @access private
     * @param code
     * @returns {*}
     */
    static getRendererClass(code)
    {
        if(code === 'GALLERY')
        {
            return EmbedGalleryComponent;
        }
        else if(code === 'IMAGE')
        {
            return EmbedImageComponent;
        }
        else
        {
            return null;
        }
    }
}
