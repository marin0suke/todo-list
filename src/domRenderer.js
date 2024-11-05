

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

export { renderProjects } ;