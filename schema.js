var mongoose = require('mongoose')
var graphql = require('graphql')
var GraphQLObjectType = graphql.GraphQLObjectType
var GraphQLBoolean = graphql.GraphQLBoolean
var GraphQLID = graphql.GraphQLID
var GraphQLString = graphql.GraphQLString
var GraphQLList = graphql.GraphQLList
var GraphQLNonNull = graphql.GraphQLNonNull
var GraphQLSchema = graphql.GraphQLSchema

// Mongoose Schema definition
var TODO = mongoose.model('Todo', {
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  completed: Boolean
})

/*
 * I’m sharing my credentials here.
 * Feel free to use it while you’re learning.
 * After that, create and use your own credential.
 * Thanks.
 *
 * to connect to a local instance of MongoDB use
 * COMPOSE_URI=mongodb://example:example@127.0.0.1:27017/todo
 */
var COMPOSE_URI_DEFAULT = 'mongodb://example:example@candidate.54.mongolayer.com:10775,candidate.57.mongolayer.com:10128/Todo?replicaSet=set-5647f7c9cd9e2855e00007fb'
mongoose.connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, function (error) {
  if (error) console.error(error)
  else console.log('mongo connected')
})
/** END */

var TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'Todo id'
    },
    title: {
      type: GraphQLString,
      description: 'Task title'
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Flag to mark if the task is completed'
    }
  })
})

var promiseListAll = () => {
  return new Promise((resolve, reject) => {
    TODO.find((err, todos) => {
      if (err) reject(err)
      else resolve(todos)
    })
  })
}

var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => {
        return promiseListAll()
      }
    }
  })
})

var MutationAdd = {
  type: new GraphQLList(TodoType),
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    var newTodo = new TODO({
      title: args.title,
      completed: false
    })
    newTodo.id = newTodo._id
    return new Promise((resolve, reject) => {
      newTodo.save(function (err) {
        if (err) reject(err)
        else promiseListAll().then(resolve, reject)
      })
    })
  }
}

var MutationToggle = {
  type: new GraphQLList(TodoType),
  description: 'Toggle the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err)
          return
        }

        if (!todo) {
          promiseListAll().then(resolve, reject)
          return
        }

        todo.completed = !todo.completed
        todo.save((err) => {
          if (err) reject(err)
          else promiseListAll().then(resolve, reject)
        })
      })
    })
  }
}

var MutationDestroy = {
  type: new GraphQLList(TodoType),
  description: 'Destroy the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        err && reject(err)
        todo && todo.remove((err) => {
          if (err) reject(err)
          else promiseListAll().then(resolve, reject)
        })
      })
    })
  }
}

var MutationToggleAll = {
  type: new GraphQLList(TodoType),
  description: 'Toggle all todos',
  args: {
    checked: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.find((err, todos) => {
        if (err) {
          reject(err)
          return
        }
        TODO.update({
          _id: {
            $in: todos.map((todo) => todo._id)
          }
        }, {
          completed: args.checked
        }, {
          multi: true
        }, (err) => {
          if (err) reject(err)
          else promiseListAll().then(resolve, reject)
        })
      })
    })
  }
}

var MutationClearCompleted = {
  type: new GraphQLList(TodoType),
  description: 'Clear completed',
  resolve: () => {
    return new Promise((resolve, reject) => {
      TODO.remove({
        completed: true
      }, (err) => {
        err && reject(err)
        TODO.find((err, todos) => {
          if (err) reject(err)
          else resolve(todos)
        })
      })
    })
  }
}

var MutationSave = {
  type: new GraphQLList(TodoType),
  description: 'Edit a todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err)
          return
        }

        if (!todo) {
          promiseListAll().then(resolve, reject)
          return
        }

        todo.title = args.title
        todo.save((err) => {
          if (err) reject(err)
          else promiseListAll().then(resolve, reject)
        })
      })
    })
  }
}

var MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    toggle: MutationToggle,
    toggleAll: MutationToggleAll,
    destroy: MutationDestroy,
    clearCompleted: MutationClearCompleted,
    save: MutationSave
  }
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})
