define(function (require, exports, module) {
	'use strict';

	// external
	var subject = require('subject'),
		_ = require('lodash');

	// object
	var query = module.exports = subject(function queryObject(database, criteria, meta) {

		this.database = database;

		this.criteria = _.clone(criteria);
		this.metaData = _.clone(meta);
	});

	// proto
	query.proto(require('./exec'));
	query.proto(require('./meta'));
});
