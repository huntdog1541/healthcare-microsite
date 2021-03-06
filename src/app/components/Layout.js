/**
 * Master layout
 * @description Layout wrapper. Used only in prerender. Client-side app renders on `document.body`
 */
import React from 'react';


class Layout extends React.Component {

	constructor(props) {

		super(props);

		// improved async Typekit loading https://goo.gl/t1jDL8
		let kitId = 'omf4gip';

		this.loadFonts = `!function(e){var t=3e3;window.sessionStorage&&"false"===sessionStorage.getItem("useTypekit")&&(t=0);var s,a={kitId:'${kitId}',scriptTimeout:t},i=e.documentElement,o=setTimeout(function(){i.className=i.className.replace(/\bwf-loading\b/g,"")+"wf-inactive",window.sessionStorage&&sessionStorage.setItem("useTypekit","false")},a.scriptTimeout),n=e.createElement("script"),c=!1,r=e.getElementsByTagName("script")[0];i.className+="wf-loading",n.src="//use.typekit.net/"+a.kitId+".js",n.async=!0,n.onload=n.onreadystatechange=function(){if(s=this.readyState,!(c||s&&"complete"!=s&&"loaded"!=s)){c=!0,clearTimeout(o);try{Typekit.load(a)}catch(e){}}},r.parentNode.insertBefore(n,r)}(document);`;

		this.GA = `
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-23605672-3', 'auto');
		`;

	}

	/**
	 * Convert a string returned by react-helmet to React DOM
	 * @param  {String} str react-helmet `meta` or `link` value from `rewind()`
	 * @return {Array} Array of React components
	 */
	_helmetToComponent(str) {

		// stop if str is empty
		if (!str.length) {
			return;
		}

		// an array of React components
		let Components = [];

		// react-helmet returns a line-break delimited list of tags
		// split so we can deal with each individually
		str.split(/\n/).forEach((node, i) => {

			// extrapolate node type
			let nodeType = str.match(/[a-z]+/)[0];

			// container for props
			let props = {
				key: i
			};

			// match attr="value" pattern
			// store props
			node.match(/([a-z\-]+=".*?")/g).forEach((attr) => {
				let matches = attr.match(/([a-z\-]+)="(.*?)"/);
				props[matches[1]] = matches[2];
			});

			// create and save the component
			Components.push(React.createElement(nodeType, props));

		});

		// return the array of components
		return Components;

	}

	render() {

		let meta = this._helmetToComponent(this.props.head.meta);
		let link = this._helmetToComponent(this.props.head.link);

		return (
			<html lang="en">
				<head>
					<title>{this.props.head.title}</title>
					<meta charSet="utf-8" />
					<meta httpEquiv="x-ua-compatible" content="ie=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{meta}
					<link rel="icon" type="image/x-icon" href="/favicon.ico" />
					<link rel="stylesheet" href="/assets/styles/main.css" />
					{link}
					<script src="http://use.typekit.net/omf4gip.js"></script>
					<script dangerouslySetInnerHTML={{__html: this.loadFonts}}></script>
					<script dangerouslySetInnerHTML={{__html: this.GA }}></script>
				</head>
				<body dangerouslySetInnerHTML={{ __html: this.props.markup }} />
				<script src="/assets/scripts/main.js" async></script>
			</html>
		);
	}
};


export default Layout;
