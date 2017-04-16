import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default class FileCollection extends Mongo.Collection
{
	constructor()
	{
		super('file');
		this.attachSchema(this.schema);
	}

	get schema()
	{
		if(!this._schema)
		{
			this._schema = new SimpleSchema({
				_id: {
					type: String,
					regEx: SimpleSchema.RegEx.Id,
					optional: false,
				},
				title: {
					type: String,
					optional: false,
				},
				url: {
					type: Number,
					optional: true,
				},
			});
		}

		return this._schema;
	}

	static getInstance()
	{
		if(!this.instance)
		{
			this.instance = new this();
		}

		return this.instance;
	}
}