export default class EntityMap
{
    _map = [];

    constructor(map = [])
    {
        this._map = map || [];
    }

    getRouteMap()
    {
        return this._map.reduce((result, entity) => {

            if (_.isObjectNotEmpty(entity.route))
            {
                Object.values(entity.route).forEach((path) => {

                    result.push({
                        path: path.path,
                        controller: path.controller,
                        params: {
                            // title: entity.title,
                        },
                    });

                });
            }

            return result;
        }, []);
    }
}
