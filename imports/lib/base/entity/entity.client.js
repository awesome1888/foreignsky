import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureClient();

export default class BaseEntity extends Entity
{
    static async findOne(condition = {})
    {
        const data = await this.wrapQCall(
            this.prepareQuery(condition),
            true
        );

        console.dir('data');
        console.dir(data);
        
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
