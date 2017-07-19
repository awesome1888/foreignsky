import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureClient();

export default class BaseEntity extends Entity
{
    static async findOne(filter = {})
    {
        const data = await this.wrapQCall(this.createQuery({
            filter,
            // select: '*',
            select: ['title'],
        }), true);

        // make instance
        return new (this.prototype.constructor)(data);
    }

    static async wrapQCall(q, one = false)
    {
        return new Promise((resolve, reject) => {
            q[one ? 'fetchOne' : 'fetch']((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        });
    }
}
