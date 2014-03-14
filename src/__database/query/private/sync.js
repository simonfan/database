define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * The heart S2.
	 *
	 *
	 * @method sync
	 * @private
	 */
	module.exports = function sync(xhrOptions) {

		var _this = this,
			defer = $.Deferred(),
			meta = this.meta(),
			loaded = this.clientExec('id').toArray(),

			// build the requestData:
			// merge criteria and metadata.
			requestData = _.extend({ loaded: loaded }, this.criteria, meta);


		this.database
			.load(requestData)
			.then(function() {
				var syncedInterval = [meta.skip, meta.skip + meta.limit];

				_this._syncedIntervals.push(syncedInterval)
				defer.resolve(_this);
			});

		return defer;
	};
});
