import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';
import {WebApp} from 'meteor/webapp';
import formidable from 'formidable';
import fs from 'fs';
import cpy from 'cpy';

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

                    // move files to upload
                    const assetFolder = this.getEntity().getLocalFolderAbsolute();

                    const type = file.type;
                    const name = file.name;
                    const path = file.path;

                    console.dir('1');

                    const match = path.match(/[^\/]+$/);
                    if (_.isStringNotEmpty(match[0]))
                    {
                        console.dir('2');

                        const autoName = match[0];
                        const newPath = `${assetFolder}/${autoName}`;

                        console.dir(`${path} => ${newPath}`);

                        try
                        {
                            cpy(path, newPath).then(() => {
                                fs.unlink(path, (uErr) => {
                                    if (!uErr)
                                    {
                                        console.dir('autoName');
                                        console.dir(autoName);

                                        console.dir('name');
                                        console.dir(name);

                                        console.dir('type');
                                        console.dir(type);

                                        console.dir('path');
                                        console.dir(path);

                                        console.dir(assetFolder);
                                        // create a db record

                                        // return the id
                                        this.finishResponse(res);
                                    }
                                    else
                                    {
                                        this.finishResponse(res, uErr);
                                    }
                                });
                            });
                        }
                        catch(e)
                        {
                            this.finishResponse(res, {copyFailed: true});
                        }
                    }
                    else
                    {
                        this.finishResponse(res, {noMatch: true});
                    }
                }
                else
                {
                    this.finishResponse(res, err);
                }
            });
        });
    }

    static finishResponse(res, err = null)
    {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
            result: !err,
        }));
    }
}
