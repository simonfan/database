//     database
//     (c) simonfan
//     database is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module database
 */
/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	// external
	var Queryable = require('backbone.collection.queryable'),
		Multisort = require('backbone.collection.multisort'),
		LazyCollection = require('backbone.collection.lazy'),
		backbone = require('lowercase-backbone'),
		_ = require('lodash');

	// internal
	var queryObject = require('./__database/query-object/index');

	// object
	var database = module.exports =
		backbone.collection
			// LazyCollection is required by Queryable.
			// but as we are using lowercase-backbone, we must extend everybody again.
			.extend(LazyCollection.prototype)
			.extend(Multisort.prototype)
			.extend(Queryable.prototype);

	database.proto({

		initialize: function initializeDatabase(models, options) {
			backbone.collection.prototype.initialize.apply(this, arguments);
			LazyCollection.prototype.initialize.apply(this, arguments);
			Multisort.prototype.initialize.apply(this, arguments);
			Queryable.prototype.initialize.apply(this, arguments);


			_.assign(this, options);

			// metadata
			this.metaData = options.metaData || _.clone(this.metaData);

			// cache
			this._cache = {};

			// cache for query objects.
			this._queries = {};
		},
		/**
		 *
		 *
		 *
		 *
		 */
		defaultQueryMeta: {
			limit: 10,
			skip: 0
		},

		/**
		 * Creates a query object linked to this
		 * database.
		 *
		 * @method query
		 * @param criteria
		 * @param metaData
		 */
		query: function query(criteria) {
			criteria = criteria || {};

			var queryId = JSON.stringify(criteria),
				// get the cached query
				query = this._queries[queryId] || queryObject(this, criteria, _.clone(this.defaultQueryMeta));

			// save to queries hash.
			this._queries[queryId] = query;

			// return query object
			return query;
		},
	});

	database.proto(require('./__database/xhr'));
});
