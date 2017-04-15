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
}