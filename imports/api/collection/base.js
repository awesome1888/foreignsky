import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default class BaseCollection extends Mongo.Collection
{
	constructor(name)
	{
		super(name);
		this.attachSchema(this.schema);
		this.addLinks(this.links);
		this.ensureIndexesExist();
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

	ensureIndexesExist()
	{
	}

	static get instance()
	{
		if(!this._instance)
		{
			this._instance = new this();
		}

		return this._instance;
	}

	/**
	 * @deprecated
	 * @returns {*}
	 */
	static getInstance()
	{
		return this.instance;
	}
}