export default class CachedRegistry
{
    _entity = null;
    _list = {};

    constructor(entity)
    {
        this._entity = entity;
    }

    async pull(ids, select = [])
    {
        const unCachedIds = this.extractUnCachedIds(ids);
        if (unCachedIds.length)
        {
            const unCached = await this._entity.find({
                filter: {_id: {$in: unCachedIds}},
                select,
            });

            console.dir('unCached');
            console.dir(unCached);
            
            if (_.isArrayNotEmpty(unCached))
            {
                unCached.forEach((item) => {
                    this._list[item.getId()] = item;
                });
            }
        }
    }

    get(id)
    {
        return this._list[id] || null;
    }

    extractUnCachedIds(ids)
    {
        return _.difference(ids, this.getCachedIds());
    }

    getCachedIds()
    {
        return Object.keys(this._list);
    }

    invalidate()
    {
        this._list = {};
    }
}
