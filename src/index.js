//     database
//     (c) simonfan
//     database is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module database
 */

define(function (require, exports, module) {
	'use strict';

	// external
	var Queryable = require('backbone.collection.queryable'),
		Multisort = require('backbone.collection.multisort'),
		backbone = require('lowercase-backbone');

	// internal
	var queryObject = require('./__database/query/index');

	// object
	var database = module.exports = backbone.collection.extend(function database(models, options) {


		backbone.collection.prototype.initialize.apply(this, arguments);
	});

	// multisortable.
	database.proto(Multisort.prototype);

	// extend Queryable.
	database.proto(Queryable.prototype);
	// modify query method, as it will be used in another meaning.
	database.proto({
		clientQuery: Queryable.prototype.query,
	});



	database.proto(require(''))




	database.proto({

		/**
		 *
		 *
		 *
		 *
		 */
		meta: {
			limit: 10,
		},

		/**
		 * Creates a query object linked to this
		 * database.
		 *
		 * @method query
		 * @param criteria
		 * @param meta
		 */
		query: function query(criteria, meta) {

			meta = _.extend({}, this.meta, meta);

			return queryObject(this, criteria, meta);
		},

		/**
		 * Maps the original requestData to
		 * different keys.
		 *
		 * @property dataMap
		 * @type Object
		 */
		dataMap: {},

		/**
		 * Receives a data object containing data about the request
		 * to be made to the database.
		 * Should return a data object with the mapped data names.

		 * @method mapRequestData
		 * @param requestData {Object}
		 * @param dataMap {Object}
		 */
		mapRequestData: function(requestData, dataMap) {

			_.each(dataMap, function(dest, src) {

				var value = requestData[src];

				// save
				requestData[dest] = _.isObject(value) ? _.clone(value) : value;

				// remove original
				delete requestData[src];
			});

			return requestData;
		},
	});
});
