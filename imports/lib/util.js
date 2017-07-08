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

    static getAssetsFolder() {
	    const project = this.getProjectFolder();
	    if (Meteor.isDevelopment)
	    {
	        return project+'public/';
        }

        return project+'../web.browser/app/';
    }
}