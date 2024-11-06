import AppController from "./AppController";
import { setupProjectSelection } from "./setupEventListeners";

function renderProjects(projects) {
    const container = document.querySelector(".projects-container");
    container.innerHTML = ""; // clear container before rendering anything.
    // set default h2 for all todos?

    projects.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        const projectTitle = document.createElement("h5");
        projectTitle.textContent = project.name; // Set the title as plain text
        projectTitle.style.marginBottom = "20px";
        projectDiv.appendChild(projectTitle);

        container.appendChild(projectDiv); // inside forEach loop so each project is attached.
    })

    setupProjectSelection(); // reapplies event listeners after rendering projects.
}

function renderDefaultProject() {
    const container = document.querySelector(".default-container");
    container.innerHTML = "";

    const defaultProject = AppController.getDefaultProject();
    let todos = defaultProject.getTodos();

    const defaultTitle = document.createElement("h2");
    defaultTitle.textContent = defaultProject.name;
    container.appendChild(defaultTitle);

    const todoList = document.createElement("ul"); // create empty list to put todos.
    todoList.classList.add("todo-list");

    // let todos = project.getTodos(); // get todos from factory function projects!

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
            renderDefaultProject();
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
            defaultProject.removeTodo(todo.title);
            renderDefaultProject();
        })
        itemContainer.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.fontSize = "10px";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            openEditForm(todo, defaultProject.name);
        });
        itemContainer.appendChild(editButton);

        todoItem.appendChild(itemContainer);

        if (todo.completed) {
            todoItem.classList.add("completed-todo");
        }

        todoList.appendChild(todoItem);

    });

    container.appendChild(todoList);
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
    submitButton.textContent = "Confirm";
    todoForm.appendChild(submitButton);

    const escNote = document.createElement("p");
    escNote.textContent = "Press ESC to cancel";
    escNote.style.fontSize = "12px";
    escNote.style.fontStyle = "italic";
    escNote.style.textAlign = "center";
    escNote.style.color = "#ffe4e6"; // Light gray color to keep it subtle
    todoForm.appendChild(escNote);

    formContainer.appendChild(todoForm); 
    document.body.appendChild(formContainer); // attach to the document body so it actually shows up.

    return formContainer;
}

function toggleForm(selector, visible) {
    document.querySelectorAll(".todo-form-container, .project-form-container").forEach(form => {
        form.style.display = "none"; // hide all forms. 
    });

    if (visible) {
        const formContainer = document.querySelector(selector);
        if (formContainer) { // if formContainer exists (standard check).
            formContainer.style.display = "block"; // make visible.
            document.addEventListener("keydown", handleEscKey); // Add ESC key listener
        } else {
            formContainer.style.display = "none";
            document.removeEventListener("keydown", handleEscKey); // Remove listener when closed
        }
    } else {
        console.error(`Element with selector "${selector}" not found.`);
    }
}

function handleEscKey(event) {
    if (event.key === "Escape") {
        toggleForm(".todo-form-container", false);
        toggleForm(".project-form-container", false);
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

    const escNote = document.createElement("p");
    escNote.textContent = "Press ESC to cancel";
    escNote.style.fontSize = "12px";
    escNote.style.fontStyle = "italic";
    escNote.style.textAlign = "center";
    escNote.style.color = "#ffe4e6"; // Light gray color to keep it subtle
    projectForm.appendChild(escNote);

    formContainer.appendChild(projectForm);
    document.body.appendChild(formContainer);

    return formContainer;
}

function openEditForm(todo, projectName) {
    const formContainer = document.querySelector(".todo-form-container");
    const todoForm = document.querySelector(".todo-form");

    // Show the form
    formContainer.style.display = "block";

    // Populate the form with the todo's current details
    todoForm.title.value = todo.title;
    todoForm.description.value = todo.description;
    todoForm.priority.value = todo.priority;
    todoForm.dueDate.value = todo.dueDate;

    // Set the form in edit mode
    todoForm.dataset.editing = "true";
    todoForm.dataset.todoTitle = todo.title;
    todoForm.dataset.projectName = projectName;
}

export { renderProjects, renderTodoForm, toggleForm, renderProjectForm, renderDefaultProject, openEditForm } ;