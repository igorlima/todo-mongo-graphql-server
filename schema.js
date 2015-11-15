import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} from 'graphql';

var TODOs = [];

var TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    id: {
      type: GraphQLInt,
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
});

var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => TODOs
    }
  })
});

var MutationAdd = {
  type: new GraphQLList(TodoType),
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, {title}) => {
    TODOs.push({
      id: (new Date()).getTime(),
      title: title,
      completed: false
    });
    return TODOs;
  }
};

var MutationToggle = {
  type: new GraphQLList(TodoType),
  description: 'Toggle the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  resolve: (root, {id}) => {
    TODOs
      .filter((todo) => todo.id === id)
      .forEach((todo) => todo.completed = !todo.completed)
    return TODOs;
  }
};

var MutationDestroy = {
  type: new GraphQLList(TodoType),
  description: 'Destroy the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  resolve: (root, {id}) => {
    return TODOs = TODOs.filter((todo) => todo.id !== id);
  }
};

var MutationToggleAll = {
  type: new GraphQLList(TodoType),
  description: 'Toggle all todos',
  args: {
    checked: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  resolve: (root, {checked}) => {
    TODOs.forEach((todo) => todo.completed = checked)
    return TODOs;
  }
};

var MutationClearCompleted = {
  type: new GraphQLList(TodoType),
  description: 'Clear completed',
  resolve: () => {
    return TODOs = TODOs.filter((todo) => !todo.completed)
  }
};

var MutationSave = {
  type: new GraphQLList(TodoType),
  description: 'Edit a todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    },
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, {id, title}) => {
    TODOs
      .filter((todo) => todo.id === id)
      .forEach((todo) => todo.title = title)
    return TODOs
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
});

export var Schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
