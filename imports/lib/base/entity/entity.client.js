import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureClient();

export default class BaseEntity extends Entity
{
    static async findOne(condition = {})
    {
        let q = null;
        if (this.isQuery(condition))
        {
            q = condition;
        }
        else
        {
            q = this.createQuery({
                filter: condition,
                select: '*',
            });
        }

        const data = await this.wrapQCall(q, true);

        // make instance
        return new this(data);
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
