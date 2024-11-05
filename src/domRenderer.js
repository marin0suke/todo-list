
function renderProjects(projects) {
    const container = document.querySelector(".projects-container");
    container.innerHTML = ""; // clear container before rendering anything.
    // set default h2 for all todos?

    projects.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        const projectTitle = document.createElement("h2");
        projectTitle.textContent = project.name; // Set the title as plain text
        projectTitle.style.marginBottom = "20px";
        projectDiv.appendChild(projectTitle);

        const todoList = document.createElement("ul"); // create empty list to put todos.
        todoList.classList.add("todo-list");

        let todos = project.getTodos(); // get todos.

        todos = todos.sort((a, b) => a.completed - b.completed); // sorts in array. completed at bottom. 

        todos.forEach(todo => { // everything created here will be attached to each todo item.
            const todoItem = document.createElement("li");
            todoItem.classList.add("todo-item");

            const itemContainer = document.createElement("div");
            itemContainer.classList.add("list-item-container");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;
            checkbox.classList.add("completed-checkbox");
            itemContainer.appendChild(checkbox);

            checkbox.addEventListener("change", () => {
                todo.completed = checkbox.checked; // Update todo completion status
                renderProjects(projects); // Re-render projects to update order and style
            });

            const textContentContainer = document.createElement("div");
            textContentContainer.classList.add("text-content");

            const itemTitle = document.createElement("span");
            itemTitle.textContent = todo.title;
            itemTitle.classList.add("item-title");
            textContentContainer.appendChild(itemTitle);

            const itemDescription = document.createElement("span");
            itemDescription.textContent = todo.description;
            itemDescription.style.fontStyle = "italic";
            itemDescription.classList.add("item-description");
            textContentContainer.appendChild(itemDescription);

            itemContainer.appendChild(textContentContainer);

            // Create date span
            const dateSpan = document.createElement("span");
            dateSpan.classList.add("todo-date");
            dateSpan.textContent = `Due: ${todo.dueDate}`;
            itemContainer.appendChild(dateSpan);

            // Create priority dot
            const priorityDot = document.createElement("span");
            priorityDot.classList.add("priority-dot");
            if (todo.priority === "High") {
                priorityDot.classList.add("high-priority");
            } else if (todo.priority === "Medium") {
                priorityDot.classList.add("medium-priority");
            } else {
                priorityDot.classList.add("low-priority");
            }
            itemContainer.appendChild(priorityDot);

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = `Del`;
            deleteButton.style.fontSize = "10px";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                project.removeTodo(todo.title);
                renderProjects(projects);
            })
            itemContainer.appendChild(deleteButton);

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.style.fontSize = "10px";
            editButton.classList.add("edit-button");
            itemContainer.appendChild(editButton);

            todoItem.appendChild(itemContainer);

            if (todo.completed) {
                todoItem.classList.add("completed-todo");
            }

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
    ["Low", "Medium", "High"].forEach(level => {
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

function toggleForm(selector, visible) {
    const formContainer = document.querySelector(selector);
    if (formContainer) {
        formContainer.style.display = visible ? "block" : "none"; // if visible var true then show container. otherwise hide.
    } else {
        console.error(`Element with selector "${selector}" not found.`);
    }
}

function renderProjectForm() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("project-form-container");
    formContainer.style.display = "none";

    const projectForm = document.createElement("form");
    projectForm.classList.add("project-form");

    const projectName = document.createElement("input");
    projectName.name = "projectTitle";
    projectName.type = "text";
    projectName.placeholder = "Name your brand new project!";
    projectForm.appendChild(projectName);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Create Project!";
    projectForm.appendChild(submitButton);

    formContainer.appendChild(projectForm);
    document.body.appendChild(formContainer);

    return formContainer;
}

export { renderProjects, renderTodoForm, toggleForm, renderProjectForm} ;