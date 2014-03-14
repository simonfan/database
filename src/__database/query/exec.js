define(function (require, exports, module) {
	'use strict';

	// external
	var _ = require('lodash');

	// internal
	var sync = require('./private/sync');

	/**
	 * Syncs the database then does a clientExec.
	 *
	 * @method exec
	 */
	exports.exec = function exec(projection, xhrOptions) {
		var defer = $.Deferred(),
			doSync = sync.call(this, xhrOptions);

		doSync.then(_.bind(function() {
			var res = this.clientExec(projection).toArray();

			defer.resolve(res);
		}, this))

		return defer;
	};




	/**
	 * Runs 'backbone.collection.database.query',
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
		// get default projection
		projection = projection || this.projection;

		// load metadata
		var sortAttributes = this.meta('sort-attributes'),
			sortDirections = this.meta('sort-directions'),
			skip = this.meta('skip'),
			limit = this.meta('limit');

		// sort the database befeore anything else.
		this.database.multisort(sortAttributes, sortDirections);

		// run the query over the sorted collection
		var res = this.database.query(this.criteria, projection);

		res = skip ? res.rest(skip) : res;
		res = limit ? res.take(limit) : res;

		return res;
	};
});
