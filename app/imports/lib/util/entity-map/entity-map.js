export default class EntityMap
{
    _map = [];

    constructor(map = [])
    {
        this._map = map || [];
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
}
