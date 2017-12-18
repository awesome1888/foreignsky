export default class Publication
{
    static getEntity()
    {
        throw new Error('Not implemented: getEntity()');
    }

    static getFilter()
    {
        return {};
    }

    static getFields()
    {
        return {_id: 1};
    }

    static make(sp)
    {
        const entity = this.getEntity();
        const name = `${entity.getUniqueCode()}.main`;

        console.dir(`Publication: ${name}`);

        Meteor.publish(name, () => {
            const cursor = entity.getCollection().find(this.getFilter(), {
                fields: this.getFields(),
            });
            this.ready();
            return cursor;
        });
    }

    static denyAll()
    {
        this.getEntity().getCollection().deny({
            insert() { return true; },
            update() { return true; },
            remove() { return true; },
        });
    }

    static declare(sp = null)
    {
        this.denyAll();
        this.make(sp);
    }
}
