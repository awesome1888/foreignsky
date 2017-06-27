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
});