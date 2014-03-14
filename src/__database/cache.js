/**
 *
 *
 * @module database
 * @submodule cache
 */
define(function(require, exports, module) {

	/**
	 *
	 *
	 * @method cache
	 * @param rData {Object}
	 */
	exports.cache = function(rData, rPromise) {
			// the request identifier is a JSON string.
		var id = JSON.stringify(rData);

		return (arguments.length < 2) ?
			this._cache[id] :
			this._cache[id] = rPromise;
	};
});
