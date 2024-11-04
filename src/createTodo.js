function createTodo (title, description, priority, dueDate, completed) {
    return {
        title,
        description,
        priority,
        dueDate,
        completed,
        toggleCompleted() {
            this.completed = !this.completed;
        },
        updateDetails(newTitle, newDescription, newPriority, newDueDate) {
            if (newTitle) this.title = newTitle;
            if (newDescription) this.description = newDescription;
            if (newPriority) this.priority = newPriority;
            if (newDueDate) this.dueDate = newDueDate;
        }
    };
}

export default createTodo;