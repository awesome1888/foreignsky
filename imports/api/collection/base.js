import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default class BaseCollection extends Mongo.Collection
{
	constructor(name)
	{
		super(name);
		this.attachSchema(this.schema);
		this.addLinks(this.links);
	}

	get schema()
	{
		if(!this._schema)
		{
			this._schema = new SimpleSchema(this.describeSchema());
		}

		return this._schema;
	}

	describeSchema()
	{
		return {
			_id: {
				type: String,
				regEx: SimpleSchema.RegEx.Id,
				optional: false,
			},
		};
	}

	get links()
	{
		if(!this._links)
		{
			this._links = this.describeLinks();
		}

		return this._links;
	}

	describeLinks()
	{
		return {};
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