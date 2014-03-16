//     database
//     (c) simonfan
//     database is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module database
 */
/* jshint ignore:start */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);

	var deps = ['should', '../src/index', 'sinon'];

	// fake server
	deps.push('../node_modules/sinon/lib/sinon/util/fake_server');
	// fake http htm request
	deps.push('../node_modules/sinon/lib/sinon/util/fake_xml_http_request');
	// event
	deps.push('../node_modules/sinon/lib/sinon/util/event');


} else {
	var deps = ['should', '../src/index', 'sinon', 'sinon-fake_server'];
}
/* jshint ignore:end */



define(deps, function (should, database, sinon, fakeServer) {
	'use strict';

	describe('Database base', function () {
		beforeEach(function () {
			this.xhr = sinon.useFakeXMLHttpRequest();
			var requests = this.requests = [];

			this.xhr.onCreate = function (xhr) {
				requests.push(xhr);
			};
		});

		it('is fine (:', function () {

			var db = database([], {
				url: 'http://fake-server.com'
			});

			db.should.be.type('object')

		});

		it('.query(criteria, metadata)', function () {
			var db = database([], {
				url: 'http://fake-server.com',
			});

			var query = db.query({
				color: 'red',
			});

			query.should.be.type('object');
		});

		describe('query object', function () {
			beforeEach(function () {
				this.db = database([], {
					url: 'http://fake-server',
				});
			});

			it('exec', function () {

			});

			it('can set meta data to be sent on request', function (done) {
				var query = this.db.query({
					color: 'red'
				});

				// set
				query.skip(10);
				query.meta('limit', 15);
				query.meta('some-data', 'some-value');

				// get
				query.meta('some-data').should.eql('some-value');

				// check if metadata is sent
				query.exec();


				setTimeout(_.bind(function () {
					this.requests.length.should.eql(1);
					// the request
					var request = this.requests[0];

					request.method.should.eql('GET');

					done();

				}, this), 0);
			});
		});


		describe.skip('database.load(requestdata, xhrOptions)', function () {
			beforeEach(function () {
				this.db = database([], {
					url: 'http://fake-server',
				});
			});

			it('checks CACHE first of all', function () {

				var cacheSpy = sinon.spy(this.db, 'cache');


				db.load({ param: 'value' });

				cacheSpy.calledWith(JSON.stringify({ param: 'value' }));
			});
		})
	});
});
