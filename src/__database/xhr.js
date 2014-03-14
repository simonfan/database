/**
 * Stuff related to xhr.
 *
 * @module database
 * @submodule xhr
 */
define(function(require, exports, module) {



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
	exports.load = function load(requestData) {

		// map the requestData
		requestData = this.mapRequestData(requestData, this.dataMap);

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
			console.log(this);

				// fetch options: Backbone.set options, jqXHR options
			var fetchOptions = _.extend({
					data: requestData,
					remove: false
				}, this.xhrOptions),
				// run fetch
				fetch = this.fetch(fetchOptions);


			// cache fetch and return it
			return this.cache(requestData, fetch);
		}

	};
});
