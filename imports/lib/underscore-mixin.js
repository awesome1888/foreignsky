_.mixin({
    /**
     * Check if the argument is a string and it is not empty
     * @param {*} value
     * @returns {boolean}
     */
    isStringNotEmpty: function(value) {
        return _.isString(value) && value.length > 0;
    },
    /**
     * Check if the argument is an array and it is not empty
     * @param {*} value
     * @returns {boolean}
     */
    isArrayNotEmpty(value) {
        return _.isArray(value) && value.length > 0;
    },
    /**
     * Check if the argument is an object and it has some own keys
     * @param {*} value
     * @returns {boolean}
     */
    isObjectNotEmpty(value) {
        return _.isObject(value) && Object.keys(value).length > 0;
    },
    makeMap(data, field, unsetKey = false)
    {
        if (_.isArrayNotEmpty(data))
        {
            return data.reduce((result, item) => {
                const key = item[field];
                if (unsetKey)
                {
                    delete item[field];
                }
                result[key] = item;
                return result;
            }, {});
        }

        return {};
    }
});
