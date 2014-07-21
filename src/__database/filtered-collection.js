/**
 * Defines general logic for filtered collections.
 *
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function (require, exports, module) {

	var backbone = require('lowercase-backbone');


	var instantiationOptions = ['database', 'filter', 'pageLength'];


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
