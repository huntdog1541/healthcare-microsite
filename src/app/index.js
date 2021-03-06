/**
 * App entry point (client-side)
 */

import React from 'react';
import Router from 'react-router';
import routes from './Routes';

require('babel-core/polyfill');

// for Chrome Dev Tools support
window.React = React;


// dispatch the router
Router.run(routes, Router.HistoryLocation, (Handler, state) => {

	// gather all routes with async data, e.g. `fetchData`
	let promises = state.routes.filter(route => {
		return route.handler.fetchData;
	}).map(route => {
		return route.handler.fetchData(state.params);
	});

	// listen for resolution, dispatch route
	Promise.all(promises).then(data => {

		// get the compiled route component
		let routePayload = React.createElement(Handler, { data: { meta: data[0], article: data[1] } });

		// render route payload
		React.render(routePayload, document.body);

		// fire ga event
		ga('send', 'pageview', state.path);

	});

});
