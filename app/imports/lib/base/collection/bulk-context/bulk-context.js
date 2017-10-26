import Collection from '../../collection/collection.js';
import { Writable } from 'stream';

export default class BulkContext
{
    BUFFER_THRESHOLD = 1000;

    _collection = null;
    _bufferUpdate = null;
    _bufferInsert = null;
    _count = 0;

    constructor(collection)
    {
        if (!(collection instanceof Collection))
        {
            throw new Error('Illegal collection passed');
        }
        this._collection = collection;
        this.clear();
    }

    update(condition, changes)
    {
        this._bufferUpdate.push({
            updateOne: {
                filter: condition,
                update: changes,
            }
        });

        this._count += 1;
        if (this._count > this.BUFFER_THRESHOLD)
        {
            this.flush();
        }
    }

    insert(data)
    {
        this._bufferInsert.push(data);

        this._count += 1;
        if (this._count > this.BUFFER_THRESHOLD)
        {
            this.flush();
        }
    }

    flush()
    {
        if (this._bufferUpdate.length)
        {
            this._collection.getRawCollection().bulkWrite(
                this._bufferUpdate
            );

            this._bufferUpdate = [];
        }
        if (this._bufferInsert.length)
        {
            // this insert is meteor _id friendly
            this._collection.batchInsert(
                this._bufferInsert
            );

            this._bufferInsert = [];
        }

        this._count = 0;
    }

    clear()
    {
        this._bufferUpdate = [];
        this._bufferInsert = [];
        this._count = 0;
    }

    getStream()
    {
        if (!this._stream)
        {
            this._stream = new Writable({
                objectMode: true,
                write: (op, encoding, callback) => {
                    if (_.isObjectNotEmpty(op))
                    {
                        op.operation = op.operation || {};
                        if (op.type === 'update')
                        {
                            this.update(op.operation.filter, op.operation.data);
                        }
                        else
                        {
                            // todo
                        }
                    }

                    callback();
                }
            });
        }

        return this._stream;
    }
}
