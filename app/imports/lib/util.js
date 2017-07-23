export default class Util
{
	static loadJs(src)
	{
		let d = document;

		if(!d || !src)
		{
			return null;
		}

		src = src.toString().trim();

		let node = d.createElement('script');
		let p = new Promise(function(resolve){
			node.addEventListener ("load", function(){

				resolve();

			}, false);
		});

		node.type = "text/javascript";
		node.setAttribute('async', 'async');
		node.setAttribute('defer', 'defer');
		node.src = src;

		let ctx = d.getElementsByTagName('head')[0] || d.body || d.documentElement;
		ctx.appendChild(node);

		return p;
	}

	static debounce(fn, timeout = 100)
	{
		let timer = 0;

		return function(...args)
		{
			clearTimeout(timer);

			timer = Meteor.setTimeout(() => {
				fn.apply(this, args);
			}, timeout || 100);
		}
	}

	static noop()
	{
		return function(){};
	}

	static passCtx(fn, extraArgs) {
		return function wrappedFn(...args) {
			fn.apply(this, _.union(extraArgs, args));
		};
	}

	static getProjectFolder() {
        const path = Npm.require('path');
        let pPath = path.resolve('.').split('.meteor')[0];

        if (pPath.charAt(pPath.length - 1) !== '/')
        {
            pPath = pPath + '/';
        }

        return pPath;
    }

    static get assetFolder() {
	    const project = this.getProjectFolder();
	    if (Meteor.isDevelopment)
	    {
	        return project+'public/';
        }

        return project+'../web.browser/app/';
    }

    static getAlphabeticalComparator()
    {
        if ('localeCompare' in String.prototype)
        {
            return (a, b) => {
                return a.localeCompare(b);
            };
        }
        else
        {
            return this.getNumericComparator(a.order, b.order);
        }
    }

    static getNumericComparator()
    {
        return (a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        };
    }
}