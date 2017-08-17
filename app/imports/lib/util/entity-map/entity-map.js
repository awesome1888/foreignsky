export default class EntityMap
{
    _map = [];
    _wMap = null;

    constructor(map = [])
    {
        this._map = map || [];

        const wMap = new WeakMap();
        this._map.forEach((item) => {
            wMap.set(item.entity, item);
        });
        this._wMap = wMap;
    }

    forEach(cb)
    {
        if (_.isFunction(cb))
        {
            this._map.forEach((item) => {
                cb(item);
            });
        }
    }

    makeListPath(entity)
    {
        // todo
    }

    makeDetailPath(entity, id)
    {
        const struct = this._wMap.get(entity);
        if (_.isObjectNotEmpty(struct))
        {
            const routeDetail = struct.route.detail.path;
            if (_.isStringNotEmpty(routeDetail))
            {
                return routeDetail.replace('#ID#', id);
            }
        }

        return '';
    }
}
