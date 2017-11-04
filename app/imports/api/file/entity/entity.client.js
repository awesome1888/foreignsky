import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';
import Util from '../../../lib/util.js';

export default class File extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static getTitle()
    {
        return 'File';
    }

    getAbsoluteUrl()
    {
        return this.constructor.makePublicUrl(this.getUrl());
    }

    getAbsoluteUrlImage(resizeTo = null)
    {
        if (_.isArrayNotEmpty(resizeTo))
        {
            resizeTo = `${parseInt(resizeTo[0])}/${parseInt(resizeTo[1])}`;
        }

        return this.constructor.makePublicUrl(this.getUrl(), resizeTo);
    }

    static makePublicUrl(url, tail = '')
    {
        url = `${url}${_.isStringNotEmpty(tail) ? `/${tail}` : ''}`;

        if (Meteor.isDevelopment)
        {
            return `http://localhost:3012/${url}`;
        }

        // todo: use the domain name from settings here!
        return `https://images.nachberlin.ru/${url}`;
    }

    static async save(id, data, parameters = {})
    {
        if (!_.isStringNotEmpty(id) && data instanceof FormData)
        {
            data.append('token', await Util.execute('user.token.get'));

            // create file in a special way
            return new Promise((resolve, reject) => {
                // todo: dont use jquery here...

                const ajaxParams = {
                    url: '/upload',
                    type: 'post',
                    contentType: false,
                    processData: false,
                    data,
                    dataType: 'json',
                    success: function(json){
                        // todo: bad move
                        resolve(json._id);
                    },
                    error: function(x, text, expl){
                        // todo: bad move
                        reject(expl);
                    },
                };

                if (_.isObjectNotEmpty(parameters) && _.isFunction(parameters.progressCallback))
                {
                    ajaxParams.xhr = () => {
                        const xhr = $.ajaxSettings.xhr();
                        xhr.upload.addEventListener('progress', (evt) => {
                            if (evt.lengthComputable)
                            {
                                parameters.progressCallback(Math.ceil(evt.loaded / evt.total * 100));
                            }
                        }, false);
                        return xhr;
                    };
                }

                $.ajax(ajaxParams);
            });
        }
        else
        {
            return await this.executeMethod('save', [id, data]);
        }
    }
}
