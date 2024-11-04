
function createProject(name) {
    const todos = []; // array of projects.

    return { // return obj.
        name,
        addTodo(todo) { // method.
            todos.push(todo);
        },

        removeTodo(todoTitle) {
            const index = todos.findIndex(todo => todo.title === todoTitle); // find index of param title and actual todo.title.
            
            if (index !== -1) { // if index exists
                return todos.splice(index, 1)[0]; // returns the extracted value that is removed. splice returns an ARRAY. [0] grabs this value for us to use.
            }
        },
        getTodos() {
            return todos;
        },
        hasTodo(todoTitle) {
            return todos.some(todo => todo.title === todoTitle); // checks for specific todo.
        }
    };
  

    //set default project to all todos.
    
    //filter todos by property.

    //get todos - return the current list of todos. getter method.
}

export default createProject;

// factory function create projects.