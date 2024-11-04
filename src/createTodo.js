function createTodo (title, description, priority, dueDate, completed) {
    return { // returns an object - factory function feature.
        title,
        description,
        priority,
        dueDate,
        completed,
        toggleCompleted() { // toggle completion status. method inside return func.
            this.completed = !this.completed;
        },
        editTodo(newTitle, newDescription, newPriority, newDueDate) { // edit todo. method inside return func.
            if (newTitle) this.title = newTitle;
            if (newDescription) this.description = newDescription;
            if (newPriority) this.priority = newPriority;
            if (newDueDate) this.dueDate = newDueDate;
        }
    }; // methods inside return func mean they are bound and have access to this keyword (individual instances).
}

export default createTodo;

// factory function create todo.