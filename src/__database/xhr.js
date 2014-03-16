/**
 * Stuff related to xhr.
 *
 * @module database
 * @submodule xhr
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Options object to be passed to the $.ajax method
	 * Example: { dataType: 'jsonp' }
	 *
	 * @property xhrOptions
	 * @type Object
	 */
	exports.xhrOptions = {};

	/**
	 * Coordinates the whole process of loading data from server.
	 *
	 * @method load
	 * @param requestData
	 */
	exports.load = function load(requestData, xhrOptions) {

		// map the requestData
		requestData = this.mapRequestData(requestData);

		// attempt to load from cache
		var cached = this.cache(requestData);

		if (cached) {
			return cached;

		} else {

			/**
			 * before, we implemented the request by ourselves,
			 * so we had to parse and add the response.
			 * The new implementation uses Bakcbone built-in fetch functionality, with some special options.
			 */

				// fetch options: Backbone.set options, jqXHR options
			var fetchOptions = _.extend({
					data: requestData,
					remove: false
				}, this.xhrOptions, xhrOptions),
				// run fetch
				fetch = this.fetch(fetchOptions);


			// cache fetch and return it
			return this.cache(requestData, fetch);
		}

	};



	/**
	 * Maps the original requestData to
	 * different keys.
	 *
	 * @property dataMap
	 * @type Object
	 */
	exports.dataMap = {};

	/**
	 * Receives a data object containing data about the request
	 * to be made to the database.
	 * Should return a data object with the mapped data names.

	 * @method mapRequestData
	 * @param requestData {Object}
	 * @param dataMap {Object}
	 */
	exports.mapRequestData = function mapRequestData(requestData) {

		_.each(this.dataMap, function (dest, src) {

			var value = requestData[src];

			// save
			requestData[dest] = value;

			// remove original
			delete requestData[src];
		});

		return requestData;
	};




	/**
	 *
	 *
	 * @method cache
	 * @param rData {Object}
	 */
	exports.cache = function (rData, rPromise) {
			// the request identifier is a JSON string.
		var id = JSON.stringify(rData);

		return (arguments.length < 2) ?
			this._cache[id] :
			this._cache[id] = rPromise;
	};


	/**
	 * Either defines or retrieves the sync status for a given
	 * requestData.
	 *
	 * @method syncStatus
	 * @param requestData
	 * @param interval
	 * @param status
	 */
	exports.syncStatus = function syncStatus(requestData, interval, status) {

	};
});
