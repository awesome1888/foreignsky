import {WebApp} from 'meteor/webapp';
import formidable from 'formidable';
import FileStorage from '../../../lib/util/file-storage/local.js';
import Security from '../../../lib/util/security/security.server.js';
import File from '../entity/entity.server.js';

export default class Middleware
{
    static declare(sp = null)
    {
        this.registerUploadPoint(sp);
    }

    static registerUploadPoint(sp = null)
    {
        WebApp.connectHandlers.use('/upload', (req, res, next) => {

            // todo: check rights here, according to the current user
            // todo: and the securityProvider

            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {

                if (!_.isObjectNotEmpty(fields) || !Security.isTokenValid(fields.token))
                {
                    res.writeHead(403);
                    res.end(JSON.stringify({
                        _id: '',
                    }));
                    return;
                }

                if (!err && _.isObjectNotEmpty(files) && _.isObject(files.file))
                {
                    const file = files.file;

                    // todo: currently only upload to the local folder provided. we can use any third-party
                    // todo: services here, or gridfs, or whatever else
                    (new FileStorage()).upload(file).then((fileStruct) => {
                        const id = File.save(null, fileStruct);
                        this.finishResponse(res, id);
                    }).catch((err) => {
                        // todo: NOTIF
                        console.dir(err.stack);
                        this.finishResponse(res, '', err);
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
        // todo: on production, better not to show the original message or stack, put them into
        // todo: the error log instead
        if (err)
        {
            res.writeHead(500);
            res.end('');
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
            _id: id,
        }));
    }
}
