import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';
import {WebApp} from 'meteor/webapp';
import formidable from 'formidable';
import FileStorage from '../../../lib/util/file-storage/local.js';

export default class extends Method
{
    static getEntity()
    {
        return Entity;
    }

    static declare(securityProvider = null)
    {
        super.declare(securityProvider);
        this.registerUploadPoint(securityProvider);
    }

    static registerUploadPoint(securityProvider)
    {
        WebApp.connectHandlers.use('/upload', (req, res, next) => {

            // todo: check rights here, according to the current user
            // todo: and the securityProvider

            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (!err && _.isObjectNotEmpty(files) && _.isObject(files.file))
                {
                    const file = files.file;

                    // todo: currently only upload to the local folder provided. we can use any third-party
                    // todo: services here, or gridfs, or whatever else
                    (new FileStorage()).upload(file).then((fileStruct) => {
                        const id = this.getEntity().save(null, fileStruct);
                        this.finishResponse(res, id);
                    });
                }
                else
                {
                    this.finishResponse(res, '', err);
                }
            });
        });
    }

    static finishResponse(res, id, err = null)
    {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
            _id: id,
        }));
    }
}
