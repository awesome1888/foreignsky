/**
 * @abstract
 * @mixin
 */
export default class BaseEntity
{
    static get collection()
    {
        throw new Error('Not implemented');
    }

    get collection()
    {
        return this.prototype.constructor.collection;
    }
}
