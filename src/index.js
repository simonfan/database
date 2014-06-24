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
	var Queryable      = require('backbone.collection.queryable'),
		Multisort      = require('backbone.collection.multisort'),
		LazyCollection = require('backbone.collection.lazy'),
		backbone       = require('lowercase-backbone'),
		_              = require('lodash'),
		q              = require('q');

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



	database.assignProto({

		/**
		 * [initialize description]
		 * @param  {[type]} models  [description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
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
		 * [defaultQueryMeta description]
		 * @type {Object}
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
				// or create a new query object
				queryObj = this._queries[queryId] || queryObject(this, criteria, _.clone(this.defaultQueryMeta));

			// save to queries hash.
			this._queries[queryId] = queryObj;

			// return query object
			return queryObj;
		},

		/**
		 * Returns only one item.
		 * As it is impossible to have gaps in 'one' sequence',
		 * always resolve promise immediately in case one model is found.
		 *
		 * @param  {[type]} criteria [description]
		 * @return {[type]}          [description]
		 */
		queryOne: function queryOne(criteria) {

			var defer = q.defer();

			criteria = criteria || {};


			// try to find locally
			var res = this.findOne(criteria);

			if (res) {
				defer.resolve(res);
			} else {
				this.query(criteria)
					.limit(1)
					.exec()
					.done(function (models) {
						defer.resolve(models[0]);
					});
			}

			return defer.promise;
		},
	});

	database.assignProto(require('./__database/xhr'));
});
