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

	var _expressGraphql = __webpack_require__(4);

	var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

	var app = (0, _express2['default'])();
	app.use('/', (0, _expressGraphql2['default'])({
	  schema: _schema.Schema,
	  pretty: true,
	  graphiql: true
	}));
	app.listen(process.env.PORT || 8080, function (err) {
	  if (err) return console.error(err);
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

	var _graphql = __webpack_require__(3);

	var TODOs = [];

	var TodoType = new _graphql.GraphQLObjectType({
	  name: 'todo',
	  fields: function fields() {
	    return {
	      id: {
	        type: _graphql.GraphQLInt,
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

	var QueryType = new _graphql.GraphQLObjectType({
	  name: 'Query',
	  fields: function fields() {
	    return {
	      todos: {
	        type: new _graphql.GraphQLList(TodoType),
	        resolve: function resolve() {
	          return TODOs;
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

	    TODOs.push({
	      id: new Date().getTime(),
	      title: title,
	      completed: false
	    });
	    return TODOs;
	  }
	};

	var MutationToggle = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Toggle the todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
	    }
	  },
	  resolve: function resolve(root, _ref2) {
	    var id = _ref2.id;

	    TODOs.filter(function (todo) {
	      return todo.id === id;
	    }).forEach(function (todo) {
	      return todo.completed = !todo.completed;
	    });
	    return TODOs;
	  }
	};

	var MutationDestroy = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Destroy the todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
	    }
	  },
	  resolve: function resolve(root, _ref3) {
	    var id = _ref3.id;

	    return TODOs = TODOs.filter(function (todo) {
	      return todo.id !== id;
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

	    TODOs.forEach(function (todo) {
	      return todo.completed = checked;
	    });
	    return TODOs;
	  }
	};

	var MutationClearCompleted = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Clear completed',
	  resolve: function resolve() {
	    return TODOs = TODOs.filter(function (todo) {
	      return !todo.completed;
	    });
	  }
	};

	var MutationSave = {
	  type: new _graphql.GraphQLList(TodoType),
	  description: 'Edit a todo',
	  args: {
	    id: {
	      name: 'Todo Id',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt)
	    },
	    title: {
	      name: 'Todo title',
	      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
	    }
	  },
	  resolve: function resolve(root, _ref5) {
	    var id = _ref5.id;
	    var title = _ref5.title;

	    TODOs.filter(function (todo) {
	      return todo.id === id;
	    }).forEach(function (todo) {
	      return todo.title = title;
	    });
	    return TODOs;
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

	module.exports = require("express-graphql");

/***/ }
/******/ ]);