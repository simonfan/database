require.config({
	urlArgs: 'bust=0.0765551021322608',
	baseUrl: '/src',
	paths: {
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		jquery: '../bower_components/jquery/dist/jquery',
		database: 'index',
		'backbone.collection.multisort': '../bower_components/backbone.collection.multisort/built/backbone.collection.multisort',
		'backbone.collection.queryable': '../bower_components/backbone.collection.queryable/built/backbone.collection.queryable',
		'backbone.collection.lazy': '../bower_components/backbone.collection.lazy/built/backbone.collection.lazy',
		backbone: '../bower_components/backbone/backbone',
		comparator: '../bower_components/comparator/built/comparator',
		deep: '../bower_components/deep/built/deep',
		containers: '../bower_components/containers/built/containers',
		itr: '../bower_components/itr/built/itr',
		'object-query': '../bower_components/object-query/built/object-query',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		'lowercase-backbone': '../bower_components/lowercase-backbone/built/lowercase-backbone',
		qunit: '../bower_components/qunit/qunit/qunit',
		'requirejs-text': '../bower_components/requirejs-text/text',
		sizzle: '../bower_components/sizzle/dist/sizzle',
		subject: '../bower_components/subject/built/subject',
		underscore: '../bower_components/underscore/underscore',
		lazy: '../bower_components/lazy.js/lazy',
		q: '../bower_components/q/q',
		sinon: '../bower_components/sinon/lib/sinon',
		'sinon-event': '../bower_components/sinon/lib/sinon/util/event',
		'sinon-fake_xml_http_request': '../bower_components/sinon/lib/sinon/util/fake_xml_http_request',
		'sinon-fake_server': '../bower_components/sinon/lib/sinon/util/fake_server'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		lazy: {
			exports: 'Lazy'
		},
		mocha: {
			exports: 'mocha'
		},
		sinon: {
			exports: 'sinon'
		},
		'sinon-fake_xml_http_request': {
			deps: [
				'sinon',
				'sinon-event'
			]
		},
		'sinon-fake_server': {
			deps: [
				'sinon',
				'sinon-fake_xml_http_request'
			]
		},
		should: {
			exports: 'should'
		}
	}
});
