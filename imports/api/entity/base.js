export default class BaseEntity
{
	constructor()
	{
		this.namedQueries = {};
		this.exposed = false;
	}

	get collectionClass()
	{
		throw new ReferenceError();
	}

	get collection()
	{
		return this.collectionClass.getInstance();
	}

	get restrictedFields()
	{
		// todo: we need white list. so we take it, and restrict all the rest
		return [];
	}

	get restrictedLinks()
	{
		// todo: we need white list. so we take it, and restrict all the rest
		return [];
	}

	restrictClientRequest(filters, options, userId)
	{
		//options.skip = params.skip;
		//options.limit = params.limit;
	}

	insert(data, cb)
	{
		return this.collection.insert(data, cb);
	}

	expose()
	{
		if(Meteor.isServer && !this.exposed)
		{
			this.collection.expose({
				firewall: this.restrictClientRequest,
				maxLimit: 1000,
				maxDepth: 5,
				restrictedFields: this.restrictedFields, // array of fields you want to restrict
				method: true,
				publication: false,
				//restrictLinks: this.restrictedLinks,
				//body, // object that will intersect with the actual request body from the client
			});

			this.exposed = true;
		}
	}

	count(filter = {})
	{
		return this.find({
			filter: filter
		}).length;
	}

	find(parameters)
	{
		return this.createQuery(this.translateParameters(parameters)).fetch();
	}

	createQuery(parameters, name = '')
	{
		if(name && name in this.namedQueries)
		{
			return this.namedQueries[name];
		}

		let query = this.collection.createQuery(this.translateParameters(parameters));

		if(name)
		{
			this.namedQueries[name] = query;
		}

		return query;
	}

	translateParameters(parameters = {})
	{
		let qParameters = {};
		if(_.isObject(parameters.filter))
		{
			qParameters.$filters = parameters.filter;
		}
		if(_.isArray(parameters.fields))
		{
			parameters.fields.forEach((item) => {
				qParameters[item] = 1;
			});
		}
		else if(_.isObject(parameters.fields))
		{
			qParameters = Object.assign(qParameters, parameters.fields);
		}

		qParameters.$options = {};

		if(_.isArray(parameters.sort))
		{
			qParameters.$options.sort = {};
			parameters.sort.forEach((item) => {

				qParameters.$options.sort[item[0]] = item[1] === 1 ? 1 : -1;

				// qParameters.$options.sort.push([
				// 	item[0], // todo: check legal field
				// 	item[1] === 'desc' ? 'desc' : 'asc'
				// ]);
			});
		}

		return qParameters;
	}

	static getInstance()
	{
		if(!this.instance)
		{
			this.instance = new this();
		}

		return this.instance;
	}
};