module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _schema = __webpack_require__(2);

	var _expressGraphql = __webpack_require__(5);

	var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

	var app = (0, _express2['default'])();
	app.use('/', (0, _expressGraphql2['default'])({
	  schema: _schema.Schema,
	  pretty: true,
	  graphiql: true
	}));
	app.listen(process.env.PORT || 8080, function (err) {
	  if (err) {
	    console.error(err);
	    return;
	  }
	  console.log('GraphQL Server is now running on localhost:' + (process.env.PORT || 8080));
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _graphql = __webpack_require__(3);

	var _mongoose = __webpack_require__(4);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	// Mongoose Schema definition
	var TODO = _mongoose2['default'].model('Todo', {
	  id: String,
	  title: String,
	  completed: Boolean
	});

	/*
	 * I’m sharing my credential here.
	 * Feel free to use it while you’re learning.
	 * After that, create and use your own credential.
	 * Thanks.
	 *
	 * COMPOSE_URI=mongodb://example:example@candidate.54.mongolayer.com:10775,candidate.57.mongolayer.com:10128/Todo?replicaSet=set-5647f7c9cd9e2855e00007fb
	 * COMPOSE_URI=mongodb://example:example@127.0.0.1:27017/todo
	 * 'example:example@candidate.54.mongolayer.com:10775,candidate.57.mongolayer.com:10128/Todo?replicaSet=set-5647f7c9cd9e2855e00007fb'
	 */
	var COMPOSE_URI_DEFAULT = 'mongodb://example:example@candidate.54.mongolayer.com:10775,candidate.57.mongolayer.com:10128/Todo?replicaSet=set-5647f7c9cd9e2855e00007fb';
	_mongoose2['default'].connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, function (error) {
	  if (error) console.error(error);else console.log('mongo connected');
	});
	/** END */

	var TodoType = new _graphql.GraphQLObjectType({
	  name: 'todo',
	  fields: function fields() {
	    return {
	      id: {
	        type: _graphql.GraphQLString,
	        description: 'Todo id'
	      },
	      title: {
	        type: _graphql.GraphQLString,
	        description: 'Task title'
	      },
	      completed: {
	        type: _graphql.GraphQLBoolean,
	        description: 'Flag to mark if the task is completed'
	      }
	    };
	  }
	});

	var promiseListAll = function promiseListAll() {
	  return new Promise(function (resolve, reject) {
	    TODO.find(function (err, todos) {
	      if (err) reject(err);else resolve(todos);
	    });
	  });
	};

	var QueryType = new _graphql.GraphQLObjectType({
	  name: 'Query',
	  fields: function fields() {
	    return {
	      todos: {
	        type: new _graphql.GraphQLList(TodoType),
	        resolve: function resolve() {
	          return promiseListAll();
	        }
	      }
	    };
	  }
	});

	var MutationAdd = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Add a Todo',
	  args: {
	    title: {
	      name: 'Todo title',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    }
	  },
	  resolve: function resolve(root, _ref) {
	    var title = _ref.title;

	    var newTodo = new TODO({
	      title: title,
	      completed: false
	    });
	    newTodo.id = newTodo._id;
	    return new Promise(function (resolve, reject) {
	      newTodo.save(function (err) {
	        if (err) reject(err);else promiseListAll().then(resolve, reject);
	      });
	    });
	  }
	};

	var MutationToggle = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Toggle the todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    }
	  },
	  resolve: function resolve(root, _ref2) {
	    var id = _ref2.id;

	    return new Promise(function (resolve, reject) {
	      TODO.findById(id, function (err, todo) {
	        if (err) {
	          reject(err);
	          return;
	        }

	        if (!todo) {
	          promiseListAll().then(resolve, reject);
	          return;
	        }

	        todo.completed = !todo.completed;
	        todo.save(function (err) {
	          if (err) reject(err);else promiseListAll().then(resolve, reject);
	        });
	      });
	    });
	  }
	};

	var MutationDestroy = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Destroy the todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    }
	  },
	  resolve: function resolve(root, _ref3) {
	    var id = _ref3.id;

	    return new Promise(function (resolve, reject) {
	      TODO.findById(id, function (err, todo) {
	        err && reject(err);
	        todo && todo.remove(function (err) {
	          if (err) reject(err);else promiseListAll().then(resolve, reject);
	        });
	      });
	    });
	  }
	};

	var MutationToggleAll = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Toggle all todos',
	  args: {
	    checked: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean)
	    }
	  },
	  resolve: function resolve(root, _ref4) {
	    var checked = _ref4.checked;

	    return new Promise(function (resolve, reject) {
	      TODO.find(function (err, todos) {
	        if (err) {
	          reject(err);
	          return;
	        }
	        TODO.update({
	          _id: {
	            $in: todos.map(function (todo) {
	              return todo._id;
	            })
	          }
	        }, {
	          completed: checked
	        }, {
	          multi: true
	        }, function (err) {
	          if (err) reject(err);else promiseListAll().then(resolve, reject);
	        });
	      });
	    });
	  }
	};

	var MutationClearCompleted = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Clear completed',
	  resolve: function resolve() {
	    return new Promise(function (resolve, reject) {
	      TODO.remove({
	        completed: true
	      }, function (err) {
	        err && reject(err);
	        TODO.find(function (err, todos) {
	          if (err) reject(err);else resolve(todos);
	        });
	      });
	    });
	  }
	};

	var MutationSave = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Edit a todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    },
	    title: {
	      name: 'Todo title',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    }
	  },
	  resolve: function resolve(root, _ref5) {
	    var id = _ref5.id;
	    var title = _ref5.title;

	    return new Promise(function (resolve, reject) {
	      TODO.findById(id, function (err, todo) {
	        if (err) {
	          reject(err);
	          return;
	        }

	        if (!todo) {
	          promiseListAll().then(resolve, reject);
	          return;
	        }

	        todo.title = title;
	        todo.save(function (err) {
	          if (err) reject(err);else promiseListAll().then(resolve, reject);
	        });
	      });
	    });
	  }
	};

	var MutationType = new _graphql.GraphQLObjectType({
	  name: 'Mutation',
	  fields: {
	    add: MutationAdd,
	    toggle: MutationToggle,
	    toggleAll: MutationToggleAll,
	    destroy: MutationDestroy,
	    clearCompleted: MutationClearCompleted,
	    save: MutationSave
	  }
	});

	var Schema = new _graphql.GraphQLSchema({
	  query: QueryType,
	  mutation: MutationType
	});
	exports.Schema = Schema;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("express-graphql");

/***/ }
/******/ ]);