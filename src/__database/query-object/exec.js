/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	// external
	var _ = require('lodash'),
		q = require('q');


	/**
	 * The heart S2.
	 *
	 *
	 * @method sync
	 * @private
	 */
	exports.sync = function sync(xhrOptions) {

		var defer = q.defer(),
			meta = this.meta(),
			loaded = this.clientExec('id').toArray(),

			// build the requestData:
			requestData = {
				meta: meta,
				loaded: loaded,
				criteria: this.criteria
			};

		this.database.load(requestData, xhrOptions)
			.then(_.partial(defer.resolve, this));

		return defer.promise;
	};

	/**
	 * Syncs the database then does a clientExec.
	 *
	 * @method exec
	 */
	exports.exec = function exec(projection, xhrOptions) {
		var defer = q.defer(),
			doSync = this.sync(xhrOptions);

		doSync.then(_.bind(function () {

			var res = this.clientExec(projection).toArray();

			defer.resolve(res);
		}, this));

		return defer.promise;
	};




	/**
	 * Runs 'database.query',
	 * checks for query meta attributes.
	 *
	 * If a sort is required, calls the database 'multisort' method.
	 * Runs database.query using the cursor's criteria hash and a projection object.
	 *
	 * If a skip is defined, use the Lazy object's rest() method.
	 * If a limit is defined, use Lazy object's take() method.
	 *
	 * @method clientExec
	 * @param [projection] {Object}
	 * @return Lazy(models)
	 */
	exports.clientExec = function clientExec(projection) {
		// load metadata
		var sortAttributes = this.meta('sort-attributes'),
			sortDirections = this.meta('sort-directions'),
			skip = this.meta('skip'),
			limit = this.meta('limit');

		// sort the database befeore anything else.
		this.database.multisort(sortAttributes, sortDirections);

		// run the query over the sorted collection
		// database.find is a method defined at Backbone.collection.queryable.
		var res = this.database.find(this.criteria, projection);

		res = skip ? res.rest(skip) : res;
		res = limit ? res.take(limit) : res;

		return res;
	};
});
