/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	// external
	var subject = require('subject'),
		_ = require('lodash');

	// object
	var query = module.exports = subject({

		initialize: function initializeQueryObject(database, criteria, meta) {

			this.database = database;

			this.criteria = _.clone(criteria);
			this.metaData = _.clone(meta);

			this._syncedIntervals = [];
		}
	});

	// proto
	query.assignProto(require('./exec'));
	query.assignProto(require('./meta'));
});
