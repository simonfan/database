/* jshint ignore:start */

/* jshint ignore:end */

define('__database/query-object/exec',['require','exports','module','lodash','q'],function (require, exports, module) {
	

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
			criteria = this.criteria,
			loaded = this.clientExec('id').toArray(),

			// build the requestData:
			requestData = { loaded: loaded };

			_.assign(requestData, meta, criteria);

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
		var defer  = q.defer(),
			doSync = this.sync(xhrOptions);

		doSync.done(_.bind(function () {

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
			skip           = this.meta('skip'),
			limit          = this.meta('limit');

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

/* jshint ignore:start */

/* jshint ignore:end */

define('__database/query-object/meta',['require','exports','module','lodash'],function (require, exports, module) {
	

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

/* jshint ignore:start */

/* jshint ignore:end */

define('__database/query-object/index',['require','exports','module','subject','lodash','./exec','./meta'],function (require, exports, module) {
	

	// external
	var subject = require('subject'),
		_ = require('lodash');

	// object
	var query = module.exports = subject({

		initialize: function initializeQueryObject(database, criteria, meta) {

			this.database = database;

			this.criteria = _.clone(criteria);
			this.metaData = _.clone(meta);

			this._syncedIntervals = [];
		}
	});

	// proto
	query.assignProto(require('./exec'));
	query.assignProto(require('./meta'));
});

/**
 * Defines general logic for filtered collections.
 *
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define('__database/filtered-collection',['require','exports','module','lowercase-backbone'],function (require, exports, module) {

	var backbone = require('lowercase-backbone');


	var instantiationOptions = ['database', 'filterModel', 'pageLength', 'formatCriteria', 'filterAttributes'];


		// direct reference to the backbone collection
		// initialization method.
	var _initialize = backbone.collection.prototype.initialize;


	var filtered = module.exports = backbone.collection.extend({

		/**
		 * Initialization logic for filtered collection.
		 * Uses database module specifications.
		 *
		 * @param  {[type]} models  [description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		initialize: function initFabFilteredCollection(models, options) {

			// initialize backbone collection
			_initialize.call(this, models, options);

			// options defaults to object
			options = options || {};

			// pick the instantiation options.
			_.each(instantiationOptions, function (opt) {
				this[opt] = options[opt] != undefined ? options[opt] : this[opt];
			}, this);

			// throw error if no database is found on object
			if (!this.database) {
				throw new Error('No database found on filtered collection.');
			}

			// create default filter (backbone.model)
			if (!this.filterModel) {
				this.filterModel = backbone.model();
			}

			// listen to change events on filterModel model
			this.listenTo(this.filterModel, 'change', this.handleFilterModelChange);
		},


		/**
		 * Either boolean or array.
		 * If array, is the selection of attribtes tobe
		 * used for filtering.
		 *
		 * @type {Boolean}
		 */
		filterAttributes: false,


		/**
		 * Formats the criteria object.
		 * Basically deletes 'falsey' values.
		 *
		 * @param  {[type]} criteria [description]
		 * @return {[type]}          [description]
		 */
		formatCriteria: function formatCriteria(criteria) {

			var res = {};

			_.each(criteria, function (v, k) {
				if (v && this.filterAttributes && _.contains(this.filterAttributes, k)) {
					res[k] = v;
				}
			}, this);

			return res;
		},

		/**
		 * The property that holds pageLength
		 * May be set on instantiation or extension.
		 *
		 * @type {Number}
		 */
		pageLength: 10,

		/**
		 * Handles change events on the filterModel model property.
		 * Basically does querying on the datbase and resets the collection.
		 *
		 * @return {[type]} [description]
		 */
		handleFilterModelChange: function handleFilterModelChange() {
			// 'this' inside listenTo by default refers
			// to the listener object

			// reset the collection immediately
			// with empty array.
			this.reset([]);

			// get copy object of the filterModel attributes
			var criteria = this.filterModel.toJSON();

			// format the criteria
			criteria = this.formatCriteria(criteria);

			// run query
			this.query(criteria)
				.done(_.bind(function (res) {

					// reset the collection with the new models.
					// pluck attributes,
					// as backbone does not recognize
					// the array of models
					// [potential bug. demandss study]
					this.reset(_.pluck(res, 'attributes'));

				}, this));
		},

		/**
		 * Method to be executed to retrieve filtered items.
		 * @return {[type]} [description]
		 */
		query: function query(criteria) {

			// build a query object
			var query = this.database.query(criteria);

			// set pagination options
			query
				.skip(this.length)
				.limit(this.pageLength);

			// execute the query and return
			return query.exec();
		},

	});

});

/**
 * Stuff related to xhr.
 *
 * @module database
 * @submodule xhr
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('__database/xhr',['require','exports','module','lodash'],function (require, exports, module) {
	

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

//     database
//     (c) simonfan
//     database is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module database
 */
/* jshint ignore:start */

/* jshint ignore:end */

define('database',['require','exports','module','backbone.collection.queryable','backbone.collection.multisort','backbone.collection.lazy','lowercase-backbone','lodash','q','./__database/query-object/index','./__database/filtered-collection','./__database/xhr'],function (require, exports, module) {
	

	// external
	var Queryable      = require('backbone.collection.queryable'),
		Multisort      = require('backbone.collection.multisort'),
		LazyCollection = require('backbone.collection.lazy'),
		backbone       = require('lowercase-backbone'),
		_              = require('lodash'),
		q              = require('q');

	// internal
	var queryObject        = require('./__database/query-object/index'),
		filteredCollection = require('./__database/filtered-collection');

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

			// default options to plain empty object
			options = options || {};

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



		/**
		 * Instantiates a filtered collection with reference to the
		 * database.
		 *
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		filtered: function buildFilteredCollection(options) {

			options = options || {};

			/**
			 * Set the database reference.
			 *
			 * @type {[type]}
			 */
			options.database = this;

			// let the filteredCollection have the same model object
			// as the database
			_filteredCollection = filteredCollection.extend({ model: this.model });

			return _filteredCollection([], options);
		}
	});

	database.assignProto(require('./__database/xhr'));
});

