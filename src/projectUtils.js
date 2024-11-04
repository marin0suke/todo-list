function moveTodosBetweenProjects(todoTitle, sourceProject, targetProject) {
    //validate input - 
    if (!sourceProject || !targetProject) {
        throw new Error("Invalid source or target project provided");
    }

    //attempt grabbing todo to move. from source.
    const removedTodo = sourceProject.removeTodo(todoTitle); // save removed in const.
    if (!removedTodo) { // check the todo we saved exists in source.
        return { // return object with structured info! shmancy!
            success: false,
            message: `Todo ${todoTitle} not found in source project ${sourceProject.name}`
        };
    }
    // attempt to add to target project.
    if (targetProject.hasTodo(todoTitle)) {
        sourceProject.addTodo(removedTodo);
        return {
            success: false,
            message: `Todo ${todoTitle} already exists in target project ${targetProject.name}`
        };
    }

    targetProject.addTodo(removedTodo);

    return {
        success: true,
        message: `Todo ${todoTitle} was successfully moved from ${sourceProject.name} to ${targetProject.name}`
    };
};


export { moveTodosBetweenProjects };

