import fs from 'fs';
import cpy from 'cpy';
import Util from '../../util.js';

export default class Local
{
    getUploadFolder()
    {
        return Util.getUploadFolder();
    }

    async upload(file)
    {
        const type = file.type;
        const name = file.name;
        const extension = this.getExtension(name);
        const path = file.path;
        const size = file.size;

        const match = path.match(/upload_([^\/]+)$/);
        if (_.isStringNotEmpty(match[1]))
        {
            const hashedName = this.secureName(match[1]);
            const newName = `${hashedName}${_.isStringNotEmpty(extension) ? `.${extension}` : ''}`;
            const dstFolder = `${this.getUploadFolder()}${hashedName.substr(0, 3)}`;
            const newPath = `${dstFolder}/${newName}`;

            // console.dir(`${path} => ${newPath}`);

            try
            {
                await this.maybeMakeFolder(this.getUploadFolder());
                await this.maybeMakeFolder(dstFolder);
                await cpy(path, dstFolder, {
                    rename: basename => newName,
                });
                await this.unlink(path);

                return {
                    name,
                    type,
                    path: newPath,
                    url: newName,
                    size,
                };
            }
            catch(e)
            {
                return null;
            }
        }

        return null;
    }

    getExtension(name)
    {
        const match = name.match(/\.([^\.]+)$/);
        if (_.isStringNotEmpty(match[1]))
        {
            return match[1];
        }

        return '';
    }

    async isExists(folder)
    {
        return new Promise((resolve) => {
            fs.stat(folder, (err) => {
                // todo: poor check
                resolve(!err);
            });
        });
    }

    async unlink(file)
    {
        return new Promise((resolve, reject) => {
            fs.unlink(file, (err) => {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(true);
                }
            });
        });
    }

    async maybeMakeFolder(folder)
    {
        const exists = await this.isExists(folder);
        if (exists)
        {
            return true;
        }

        return new Promise((resolve, reject) => {
            fs.mkdir(folder, 0o755, (err) => {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(true);
                }
            });
        });
    }

    secureName(name)
    {
        return name.replace(/\.+/g, '.');
    }
}
