/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Either sets or gets a query-metadata.
	 *
	 * @method meta
	 * @param name {String}
	 * @param [value] {*}
	 */
	exports.meta = function meta(name, value) {

		if (arguments.length === 1) {
			// getter
			return this.metaData[name];

		} else if (arguments.length === 2) {
			// setter
			this.metaData[name] = value;

			return this;

		} else if (arguments.length === 0) {
			// mega getter
			return _.clone(this.metaData);
		}
	};


	// simplifying partials.
	exports.skip = _.partial(exports.meta, 'skip');
	exports.limit = _.partial(exports.meta, 'limit');


	/**
	 * Sets the special meta-data relative to sorting order.
	 * This method must be called individually, so that
	 * the sorting priority is defined by method calling order.
	 *
	 * If the method is called
	 *
	 * @method sortBy
	 * @param attribute {String|Array}
	 * @param direction {+1, -1|Object}
	 */
	exports.sortBy = function sortBy(attribute, direction) {

		if (_.isString(attribute)) {

				// [1] get the current sorting attributes OR create a new one.
			var attributes = this.meta('sorting-attributes') || [],
				// [2] get the current sorting directions OR create a new one.
				directions = this.meta('sorting-directions') || {};

			// [3] add the attribute to the sorting attributes
			attributes.push(attribute);

			// [4] set the sorting-direction for that attribute
			directions[attribute] = direction;

			// [5] reset sorting-attributes AND sorting-directions
			this.meta('sorting-attributes', attributes)
				.meta('sorting-directions', directions);

		} else if (_.isArray(attribute)) {

			// DIRECTLY SET!
			this.meta('sorting-attributes', attribute)
				.meta('sorting-directions', direction);
		}

		return this;
	};
});
