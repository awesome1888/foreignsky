import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureOnClient();

export default class BaseEntity extends Entity
{
    static getTitle()
    {
        return 'Spherical entity in vacuum';
    }

    static async findById(id, extra = {}, parameters = {})
    {
        const condition = {filter: {_id: id}};
        if ('select' in extra)
        {
            condition.select = extra.select;
        }

        return await this.findOne(condition, parameters);
    }

    static async findOne(condition = {}, parameters = {})
    {
        if (!_.isObject(condition))
        {
            throw new TypeError('Argument should be an object and may contain keys "filter", "select", etc.');
        }

        condition.limit = 1;
        const data = await this.executeMethod('find', [condition]);

        if (_.isArrayNotEmpty(data))
        {
            if (parameters.returnArray === true)
            {
                return data[0];
            }

            return new this(data[0]);
        }

        return null;
    }

    static async find(condition = {}, parameters = {})
    {
        if (!_.isObject(condition))
        {
            throw new TypeError('Argument should be an object and may contain keys "filter", "select", etc.');
        }

        const data = await this.executeMethod('find', [condition]);

        if (_.isArrayNotEmpty(data))
        {
            if (parameters.returnArray === true)
            {
                return data;
            }

            return data.map(item => new this(item));
        }

        return [];
    }

    static async getCount(filter = {})
    {
        let count = parseInt(await this.executeMethod('count.get', [filter]));
        if (isNaN(count))
        {
            return 0;
        }

        return count;
    }

    static async save(id, data)
    {
        return await this.executeMethod('save', [id, data]);
    }

    static async remove(filter = {})
    {
        return await this.executeMethod('remove', [filter]);
    }

    static async removeById(id)
    {
        return await this.remove({_id: id});
    }

    static async executeMethod(name, args)
    {
        return new Promise((resolve, reject) => {
            Meteor.apply(this.makeMethodName(name), args, (err, res) => {
                if (err)
                {
                    reject(err);
                    return;
                }

                resolve(res);
            });
        });
    }

    static makeMethodName(name)
    {
        return `${this.getUniqueCode()}.${name}`;
    }

    static reloadPublished()
    {
        window.__t = new ReactiveVar();
        window.__t.set(Option.find().fetch());
    }

    static getReactiveVar()
    {
        
    }

    async save(id, data)
    {
        throw new Error('Not implemened: save()');
    }

    async remove(filter = {})
    {
        throw new Error('Not implemened: delete()');
    }
}
