import {Meteor} from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

import Side from '../side.js';

Side.ensureOnServer();

export default class FileUploader
{
    static initialize()
    {
        const instance = new this();
        instance.registerUrl();

        return instance;
    }

    constructor()
    {
    }

    registerUrl()
    {
        WebApp.connectHandlers.use('/upload', (req, res, next) => {

            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {

                console.dir('!!!');
                if (!err)
                {
                    console.dir(fields);
                    console.dir(files);
                }
                else
                {
                    console.dir(err);
                }

                res.writeHead(200);
                res.end(JSON.stringify({
                    all: 'ok!',
                }));
            });
        });


        // const matchPath = matchPathFactory(req);
            //
            // if (matchPath('/server/upload')) {
            //     const form = new formidable.IncomingForm();
            //
            //     form.parse(req, (err, fields, files) => {
            //
            //         console.dir(err);
            //         console.dir(fields);
            //         console.dir(files);
            //
            //         // const fileId = App.getId();
            //         // const fileName = fileId + path.extname(files.file.name);
            //         // const db = Meteor.users.rawDatabase();
            //         // const gs = new MongoDb.GridStore(db, fileId, fileName, 'w');
            //         //
            //         // gs.open((err, gs) => {
            //         //     App.handleError(err);
            //         //
            //         //     gs.writeFile(files.file.path, (err, gridStore) => {
            //         //         App.handleError(err);
            //         //
            //         //         gridStore.close((err, data) => {
            //         //             if (err) {
            //         //                 throw err;
            //         //             }
            //         //
            //         //             res.setHeader('Content-Type', 'application/json');
            //         //             res.end(JSON.stringify({
            //         //                 id: data._id,
            //         //                 name: data.filename
            //         //             }));
            //         //         });
            //         //     });
            //         // });
            //     });
            // }
        /// });

    }
}