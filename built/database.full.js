//     BackboneCollectionLazy
//     (c) simonfan
//     BackboneCollectionLazy is licensed under the MIT terms.

//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

//     Iterator
//     (c) simonfan
//     Iterator is licensed under the MIT terms.

//     Deep
//     (c) simonfan
//     Deep is licensed under the MIT terms.

//     Containers
//     (c) simonfan
//     Containers is licensed under the MIT terms.

//     ObjectMatcher
//     (c) simonfan
//     ObjectMatcher is licensed under the MIT terms.

//     backbone.collection.queryable
//     (c) simonfan
//     backbone.collection.queryable is licensed under the MIT terms.

//     comparator
//     (c)
//     comparator is licensed under the MIT terms.

//     BackboneCollectionMultisort
//     (c) simonfan
//     BackboneCollectionMultisort is licensed under the MIT terms.

//     lowercase-backbone
//     (c) simonfan
//     lowercase-backbone is licensed under the MIT terms.

//     database
//     (c) simonfan
//     database is licensed under the MIT terms.

var lazyJsName="function"==typeof define?"lazy":"lazy.js";define("backbone.collection.lazy",["backbone",lazyJsName],function(e,t){function r(e){n.prototype[e]=function(){var r=t(this.models),n=Array.prototype.slice.call(arguments);return r[e].apply(r,n)}}var n=e.Collection.extend({}),i=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];return t(i).each(r),n}),define("__subject/private/assign",["require","exports","module","lodash"],function(e,t,r){function n(e,t,r){if(o.defaults(r,a),!o.isArray(t))throw new Error("Currently subject.assign does not accept non-array properties for accessor assignment.");o.each(t,function(t){var n=o.extend({},r);n.get&&(n.get=o.partial(n.get,t)),n.set&&(n.set=o.partial(n.set,t)),Object.defineProperty(e,t,n)})}function i(e,t,r){o.defaults(r,s),o.each(t,function(t,n){var i=o.assign({value:t},r);Object.defineProperty(e,n,i)})}var o=e("lodash"),a={configurable:!0,enumerable:!0},s=o.extend({writable:!0},a);r.exports=function(e,t,r){return r?r.get||r.set?n(e,t,r):i(e,t,r):o.assign(e,t),e}}),define("__subject/public/assign-proto",["require","exports","module","lodash","../private/assign"],function(e,t,r){var n=e("lodash"),i=e("../private/assign");r.exports=function(){var e,t;return n.isObject(arguments[0])?(e=arguments[0],t=arguments[1]):n.isString(arguments[0])&&(e={},e[arguments[0]]=arguments[1],t=arguments[2]),i(this.prototype,e,t),this}}),define("__subject/public/proto-merge",["require","exports","module","lodash","../private/assign"],function(e,t,r){var n=e("lodash"),i=e("../private/assign");r.exports=function(){var e,t,r;if(n.isString(arguments[0])){var o=arguments[0];e=this.prototype[o],t=arguments[1],r=arguments[2],this.prototype[o]=i(n.create(e),t,r)}else r=arguments[1],n.each(arguments[0],n.bind(function(e,t){this.protoMerge(t,e,r)},this));return this}}),define("__subject/public/extend",["require","exports","module","lodash","../private/assign"],function(e,t,r){var n=e("lodash"),i=e("../private/assign");r.exports=function(e,t){var r,o=this;return r=function(){var e=n.create(r.prototype);return e.initialize.apply(e,arguments),e},i(r,n.pick(o,o.staticProperties),{enumerable:!1}),r.prototype=n.create(o.prototype),r.assignProto(e,t),i(r.prototype,{constructor:r,__super__:o.prototype},{enumerable:!1}),r}}),define("subject",["require","exports","module","lodash","./__subject/private/assign","./__subject/public/assign-proto","./__subject/public/assign-proto","./__subject/public/proto-merge","./__subject/public/extend"],function(e,t,r){var n=e("lodash"),i=e("./__subject/private/assign"),o=function(){};o.prototype=i({},{initialize:function(){}},{enumerable:!1}),i(o,{staticProperties:["proto","assignProto","protoMerge","staticProperties","assignStatic","extend"],assignStatic:function(e,t){return this.staticProperties=n.union(this.staticProperties,n.keys(e)),i(this,e,t)},assignProto:e("./__subject/public/assign-proto"),proto:e("./__subject/public/assign-proto"),protoMerge:e("./__subject/public/proto-merge"),extend:e("./__subject/public/extend")},{enumerable:!1}),r.exports=n.bind(o.extend,o);var a={assign:i};i(r.exports,a,{enumerable:!1,writable:!1,configurable:!1})}),define("iterator/base",["subject","lodash"],function(e,t){var r=e({initialize:function(e,t){this.data=e,t=t||{},this.currentIndex=t.startAt||-1,this.options=t,this.evaluate=t.evaluate||t.evaluator||this.evaluate},move:function(e){return this.index(this.currentIndex+e),this},evaluate:function(e){return e},evaluator:function(e){return this.evaluate=e,this},start:function(){return this.currentIndex=-1,this},end:function(){return this.currentIndex=this.length(),this},index:function(e){if(e>this.length()-1||0>e)throw new Error("No such index "+e);return this.currentIndex=e,this},countBefore:function(){return this.currentIndex+1},countAfter:function(){return this.length()-(this.currentIndex+1)},range:function(e,t){for(var r=[];t>=e;)r.push(this.at(e)),e++;return r},hasNext:function(){return this.currentIndex<this.length()-1},next:function(){return this.move(1),this.current()},nextN:function(e){for(var t=[],r=this.currentIndex+e-1;this.hasNext()&&this.currentIndex<=r;)t.push(this.next());return t},hasPrevious:function(){return this.currentIndex>0},previous:function(){return this.move(-1),this.current()},previousN:function(e){for(var t=[],r=this.currentIndex-e+1;this.hasPrevious()&&this.currentIndex>=r;)t.push(this.previous());return t},current:function(){return this.at(this.currentIndex)},value:function(){return this.data}});r.proto({hasPrev:r.prototype.hasPrevious,prev:r.prototype.previous,prevN:r.prototype.previousN});var n=["map","filter","compact","difference"];return t.each(n,function(e){r.proto(e,function(){var r=t(this.data);r=r[e].apply(r,arguments);var n=this.constructor(r.value());return n})}),r}),define("iterator/array",["require","exports","module","./base","lodash"],function(e){var t=e("./base"),r=e("lodash"),n=t.extend({at:function(e){return this.evaluate(this.data[e],e)},length:function(){return this.data.length}}),i=["push","reverse","shift","sort","splice","unshift"];return r.each(i,function(e){n.proto(e,function(){return this.data[e].apply(this.data,arguments),this})}),r.each(["concat","slice"],function(e){n.proto(e,function(){var t=this.data[e].apply(this.data,arguments);return this.constructor(t)})}),n}),define("iterator/object",["require","exports","module","./base","lodash"],function(e){var t=e("./base"),r=e("lodash"),n=t.extend({initialize:function(e,n){n=n||{},t.prototype.initialize.apply(this,arguments),this.order=n.order||r.keys(e)},keyAt:function(e){return this.order[e]},at:function(e){var t=this.keyAt(e),r=this.data[t];return this.evaluate(r,t)},length:function(){return this.order.length},nextKey:function(){return this.keyAt(this.currentIndex+1)},currentKey:function(){return this.keyAt(this.currentIndex)},previousKey:function(){return this.keyAt(this.currentIndex-1)},map:function(e){var t={};return r.each(this.order,function(r,n){t[r]=e(this.data[r],r,n)}.bind(this)),this.constructor(t)}});return n.proto("constructor",n),n}),define("itr",["require","exports","module","./iterator/array","./iterator/object","lodash"],function(e){var t=e("./iterator/array"),r=e("./iterator/object"),n=e("lodash"),i=function(e){var i;return n.isArray(e)?i=t:n.isObject(e)&&(i=r),i.apply(this,arguments)};return i.object=r,i.array=t,i}),define("__deep__/keys",["require","exports","module"],function(){return function(e){return e.replace(/\[(["']?)([^\1]+?)\1?\]/g,".$2").replace(/^\./,"").split(".")}}),define("__deep__/walker",["require","exports","module","lodash","itr","./keys"],function(e,t,r){var n=e("lodash"),i=e("itr"),o=e("./keys"),a=i.object.extend({nextStep:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.nextKey().replace(e,"")},currentStep:function(){var e=new RegExp("^"+this.previousKey()+"\\.");return this.currentKey().replace(e,"")},previousStep:function(){var e=this.previousKey()||"";return n.last(e.split("."))},remainingSteps:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.destination().replace(e,"")},destination:function(){return n.last(this.order)}});r.exports=function(e,t){t=n.isArray(t)?t:o(t);var r={"":e},i=[""];return n.every(t,function(o,a){var s=n.first(t,a+1).join(".");return i.push(s),e=e[o],r[s]=e,!n.isUndefined(e)}),a(r,{order:i})}}),define("__deep__/getset",["require","exports","module","lodash","./keys"],function(e,t){var r=e("lodash"),n=e("./keys");t.get=function(e,t){return t=r.isArray(t)?t:n(t),r.reduce(t,function(e,t){return e[t]},e)},t.set=function(e,i,o){i=r.isArray(i)?i:n(i);var a=i.pop();e=t.get(e,i),e[a]=o}}),define("deep",["require","exports","module","lodash","./__deep__/keys","./__deep__/walker","./__deep__/getset"],function(e){var t=e("lodash"),r={};return r.parseKeys=e("./__deep__/keys"),r.walker=e("./__deep__/walker"),t.extend(r,e("./__deep__/getset")),r}),define("containers",["lodash"],function(){function e(e,t){return _.all(t,function(t){return _.contains(e,t)})}function t(e,t){return _.any(t,function(t){return _.contains(e,t)})}function r(e,t){return e[0]<t&&t<e[1]}function n(e,t){return e[0]<=t&&t<=e[1]}function i(e,t,i){var o=i?r:n;return o=_.partial(o,e),_.isArray(t)?_.every(t,o):o(t)}return{containsAll:e,containsAny:t,exclusiveWithin:r,inclusiveWithin:n,within:i}}),define("__object-query__/operators/match",["require","exports","module","lodash"],function(e,t){var r=e("lodash");t.$matchSingle=function(e,t){return r.isRegExp(e)?e.test(t):e===t},t.$match=function(e,n){return r.isArray(n)?r.any(n,function(r){return t.$matchSingle(e,r)}):t.$matchSingle(e,n)}}),define("__object-query__/operators/range",["require","exports","module"],function(e,t){t.$lt=function(e,t){return e>t},t.$lte=function(e,t){return e>=t},t.$gt=function(e,t){return t>e},t.$gte=function(e,t){return t>=e}}),define("__object-query__/operators/set",["require","exports","module","lodash","containers"],function(e,t){var r=e("lodash"),n=e("containers");t.$in=function(e,t){return r.isArray(t)?n.containsAny(e,t):r.contains(e,t)},t.$nin=function(e,t){return r.isArray(t)?!n.containsAny(e,t):!r.contains(e,t)},t.$all=function(e,t){return n.containsAll(t,e)}}),define("__object-query__/operators/boolean",["require","exports","module"],function(e,t){t.$e=function(){},t.$ne=function(){},t.$not=function(){},t.$or=function(){},t.$and=function(){},t.$exists=function(){}}),define("__object-query__/operators/index",["require","exports","module","lodash","deep","containers","./match","./range","./set","./boolean"],function(e,t){var r=e("lodash");e("deep"),e("containers"),r.extend(t,e("./match"),e("./range"),e("./set"),e("./boolean")),t.evaluateValue=function(e,n){return r.isObject(e)&&!r.isRegExp(e)?r.every(e,function(e,r){var i=t[r];if(i)return i(e,n);throw new Error("The operator "+r+" is not supported by object-query.")}):t.$match(e,n)}}),define("__object-query__/match",["require","exports","module","lodash","deep","./operators/index"],function(e,t,r){var n=e("lodash"),i=e("deep"),o=e("./operators/index"),a=/[0-9]+/,s=function(e,t,r){return n.any(t,function(t){return u(e,t,r)})},u=r.exports=function(e,t,r){for(var u,c=i.walker(t,r);c.hasNext();){var l=c.next();if(!c.hasNext()){u=o.evaluateValue(e,l);break}if(n.isArray(l)&&!a.test(c.nextStep())){u=s(e,l,c.remainingSteps());break}}return u}}),define("__object-query__/find",["require","exports","module","lodash","deep","./operators/index"],function(e,t,r){var n=e("lodash"),i=e("deep"),o=e("./operators/index"),a=/[0-9]+/,s=function(e,t,r){return n.any(t,function(t){return u(e,t,r)})},u=r.exports=function(e,t,r){for(var u,c=i.walker(t,r);c.hasNext();){var l=c.next();if(!c.hasNext()){u=o.evaluateValue(e,l);break}if(n.isArray(l)&&!a.test(c.nextStep())){u=s(e,l,c.remainingSteps());break}}return u}}),define("object-query",["require","exports","module","lodash","./__object-query__/match","./__object-query__/find"],function(e){function t(e,t){return r.every(e,function(e,r){return n(e,t,r)})}var r=e("lodash"),n=e("./__object-query__/match");e("./__object-query__/find");var i=function(e){return e=e||{},r.partial(t,e)},o=["every","all","some","any","filter","find","reject"];return r.each(o,function(e){i[e]=function(t,n){return r[e](t,i(n))}}),i}),define("backbone.collection.queryable",["require","exports","module","backbone.collection.lazy","object-query","lodash"],function(e){var t=e("backbone.collection.lazy"),r=e("object-query"),n=e("lodash"),i=t.extend({find:function(e,t){var n=this,i=r(e),o=this.filter(function(e){return i(e.attributes)});return t?o.map(function(e){return n.project(e.attributes,t)}):o},findOne:function(e){var t=this.find(e).take(1).first();return t},project:function(e,t){if(n.isString(t))return e[t];if(n.isArray(t)){var r={};return n.each(t,function(t){r[t]=e[t]}),r}if(n.isObject(t)){var r={};return n.each(t,n.bind(function(t,n){r[n]=t===!0?e[n]:this.project(e[n],t)},this)),r}}});return i}),define("comparator",["lodash"],function(e){function t(e,t,r){return e===t?0:e>t?1*r:-1*r}var r=function(r,n,i){r=e.isString(r)?[r]:r,n=n||{},i=i||{};var o=i.root;return function(i,a){return i=o?i[o]:i,a=o?a[o]:a,e.reduce(r,function(r,o){if(0===r){var s=i[o],u=a[o],c=e.isNumber(n)?n:n[o]?n[o]:1;return t(s,u,c)}return r},0)}};return r}),define("backbone.collection.multisort",["backbone","comparator"],function(e,t){function r(e,t){return JSON.stringify({attributes:e,directions:t})}var n=e.Collection.extend({_multisortId:!1,isSorted:function(e,t){return this._multisortId===r(e,t)},multisort:function(e,n,i){var o=r(e,n);if(this._multisortId!==o){this.comparator=t(e,n,{root:"attributes"});{this.sort(i)}this._multisortId=o}return this}});return n}),define("lowercase-backbone",["require","exports","module","subject","backbone","lodash"],function(e,t,r){var n=e("subject"),i=e("backbone"),o=e("lodash"),a=r.exports={};a.model=n(i.Model.prototype),a.model.proto("initialize",function(e,t){var r=e||{};t||(t={}),this.cid=o.uniqueId("c"),this.attributes={},t.collection&&(this.collection=t.collection),t.parse&&(r=this.parse(r,t)||{}),r=o.defaults({},r,o.result(this,"defaults")),this.set(r,t),this.changed={}}),a.collection=n(i.Collection.prototype),a.collection.proto("initialize",function(e,t){t||(t={}),t.model&&(this.model=t.model),void 0!==t.comparator&&(this.comparator=t.comparator),this._reset(),e&&this.reset(e,o.extend({silent:!0},t))}),a.view=n(i.View.prototype),a.view.proto("initialize",function(e){this.cid=o.uniqueId("view"),e||(e={}),o.extend(this,o.pick(e,viewOptions)),this._ensureElement(),this.delegateEvents()}),a.router=n(i.Router.prototype),a.router.proto(function(e){e||(e={}),e.routes&&(this.routes=e.routes),this._bindRoutes()}),a.history=i.history}),define("__database/query-object/exec",["require","exports","module","lodash","q"],function(e,t){var r=e("lodash"),n=e("q");t.sync=function(e){var t=n.defer(),i=this.meta(),o=this.criteria,a=this.clientExec("id").toArray(),s={loaded:a};return r.assign(s,i,o),this.database.load(s,e).then(r.partial(t.resolve,this)),t.promise},t.exec=function(e,t){var i=n.defer(),o=this.sync(t);return o.done(r.bind(function(){var t=this.clientExec(e).toArray();i.resolve(t)},this)),i.promise},t.clientExec=function(e){var t=this.meta("sort-attributes"),r=this.meta("sort-directions"),n=this.meta("skip"),i=this.meta("limit");this.database.multisort(t,r);var o=this.database.find(this.criteria,e);return o=n?o.rest(n):o,o=i?o.take(i):o}}),define("__database/query-object/meta",["require","exports","module","lodash"],function(e,t){var r=e("lodash");t.meta=function(e,t){return 1===arguments.length?this.metaData[e]:2===arguments.length?(this.metaData[e]=t,this):0===arguments.length?r.clone(this.metaData):void 0},t.skip=r.partial(t.meta,"skip"),t.limit=r.partial(t.meta,"limit"),t.sortBy=function(e,t){if(r.isString(e)){var n=this.meta("sorting-attributes")||[],i=this.meta("sorting-directions")||{};n.push(e),i[e]=t,this.meta("sorting-attributes",n).meta("sorting-directions",i)}else r.isArray(e)&&this.meta("sorting-attributes",e).meta("sorting-directions",t);return this}}),define("__database/query-object/index",["require","exports","module","subject","lodash","./exec","./meta"],function(e,t,r){var n=e("subject"),i=e("lodash"),o=r.exports=n({initialize:function(e,t,r){this.database=e,this.criteria=i.clone(t),this.metaData=i.clone(r),this._syncedIntervals=[]}});o.assignProto(e("./exec")),o.assignProto(e("./meta"))}),define("__database/filtered-collection",["require","exports","module","lowercase-backbone"],function(e,t,r){{var n=e("lowercase-backbone"),i=["database","filterModel","pageLength","formatCriteria","filterAttributes"],o=n.collection.prototype.initialize;r.exports=n.collection.extend({initialize:function(e,t){if(o.call(this,e,t),t=t||{},_.each(i,function(e){this[e]=void 0!=t[e]?t[e]:this[e]},this),!this.database)throw new Error("No database found on filtered collection.");this.filterModel||(this.filterModel=n.model()),this.listenTo(this.filterModel,"change",this.handleFilterModelChange)},filterAttributes:!1,formatCriteria:function(e){var t={};return _.each(e,function(e,r){e&&this.filterAttributes&&_.contains(this.filterAttributes,r)&&(t[r]=e)},this),t},pageLength:10,handleFilterModelChange:function(){this.reset([]);var e=this.filterModel.toJSON();e=this.formatCriteria(e),this.query(e).done(_.bind(function(e){this.reset(_.pluck(e,"attributes"))},this))},query:function a(e){var a=this.database.query(e);return a.skip(this.length).limit(this.pageLength),a.exec()}})}}),define("__database/xhr",["require","exports","module","lodash"],function(e,t){var r=e("lodash");t.xhrOptions={},t.load=function(e,t){e=this.mapRequestData(e);var n=this.cache(e);if(n)return n;var i=r.extend({data:e,remove:!1},this.xhrOptions,t),o=this.fetch(i);return this.cache(e,o)},t.dataMap={},t.mapRequestData=function(e){return r.each(this.dataMap,function(t,r){var n=e[r];e[t]=n,delete e[r]}),e},t.cache=function(e,t){var r=JSON.stringify(e);return arguments.length<2?this._cache[r]:this._cache[r]=t},t.syncStatus=function(){}}),define("database",["require","exports","module","backbone.collection.queryable","backbone.collection.multisort","backbone.collection.lazy","lowercase-backbone","lodash","q","./__database/query-object/index","./__database/filtered-collection","./__database/xhr"],function(e,t,r){var n=e("backbone.collection.queryable"),i=e("backbone.collection.multisort"),o=e("backbone.collection.lazy"),a=e("lowercase-backbone"),s=e("lodash"),u=e("q"),c=e("./__database/query-object/index"),l=e("./__database/filtered-collection"),h=r.exports=a.collection.extend(o.prototype).extend(i.prototype).extend(n.prototype);h.assignProto({initialize:function(e,t){a.collection.prototype.initialize.apply(this,arguments),o.prototype.initialize.apply(this,arguments),i.prototype.initialize.apply(this,arguments),n.prototype.initialize.apply(this,arguments),t=t||{},s.assign(this,t),this.metaData=t.metaData||s.clone(this.metaData),this._cache={},this._queries={}},defaultQueryMeta:{limit:10,skip:0},query:function(e){e=e||{};var t=JSON.stringify(e),r=this._queries[t]||c(this,e,s.clone(this.defaultQueryMeta));return this._queries[t]=r,r},queryOne:function(e){var t=u.defer();e=e||{};var r=this.findOne(e);return r?t.resolve(r):this.query(e).limit(1).exec().done(function(e){t.resolve(e[0])}),t.promise},filtered:function(e){return e=e||{},e.database=this,(_filteredCollection=l.extend({model:this.model}))([],e)}}),h.assignProto(e("./__database/xhr"))});