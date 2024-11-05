

function renderProjects(projects) {
    const container = document.querySelector(".projects-container");
    container.innerHTML = ""; // clear container before rendering anything.
    // set default h2 for all todos?

    projects.forEach(project = () => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");
        projectDiv.textContent = `<h2>${project.name}</h2>`; // not sure if correct.

        const todoList = document.createElement("ul"); // create empty list to put todos.
        const todos = project.getTodos(); // get todos.
        todos.forEach(todo => () => {
            const todoItem = document.createElement("li");
            todoItem.textContent = `${todo.title} - Priority ${todo.priority}`;
            todoList.appendChild(todoItem);
        });

        projectDiv.appendChild(todoList);
        container.appendChild(projectDiv); // inside forEach loop so each project is attached.
    })
}

function renderTodoForm() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("todo-form-container");
    formContainer.style.display = "none"; // initially hidden.

    const todoForm = document.createElement("form");
    todoForm.classList.add("todo-form");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title"; // check how this changes from id - which is better, use both?
    titleInput.placeholder = "What would you like to do?";
    todoForm.appendChild(titleInput);

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.name = "description";
    descriptionInput.placeholder = "Description";
    todoForm.appendChild(descriptionInput);

    const priorityInput = document.createElement("select");
    priorityInput.name = "priority";
    ["Low", "Medium", "High"] = forEach(level => {
        const option = document.createElement("option");
        option.textContent = level;
        option.value = level;
        priorityInput.appendChild(option);
    });
    todoForm.appendChild(priorityInput);

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.name = "dueDate";
    todoForm.appendChild(dueDateInput);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Todo";
    todoForm.appendChild(submitButton);

    formContainer.appendChild(todoForm); 
    document.body.appendChild(formContainer); // attach to the document body so it actually shows up.

    return formContainer;
}

export { renderProjects } ;