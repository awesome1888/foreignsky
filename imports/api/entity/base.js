export default class BaseEntity
{
	constructor()
	{
	}

	get collectionClass()
	{
		throw new ReferenceError();
	}

	get collection()
	{
		return this.collectionClass.getInstance();
	}

	expose()
	{
		this.collection.expose();
	}

	count(filter = {})
	{
		return this.find({
			filter: filter
		}).length;
	}

	find(parameters)
	{
		let qParameters = {};
		if(_.isObject(parameters.filter))
		{
			qParameters.$filter = parameters.filter;
		}
		if(_.isArray(parameters.fields))
		{
			parameters.fields.forEach((item) => {
				qParameters[item] = 1;
			});
		}

		return this.createQuery(qParameters).fetch();
	}

	createQuery(parameters)
	{
		return this.collection.createQuery(parameters);
	}
};