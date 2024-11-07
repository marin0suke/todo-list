import AppController from "./AppController";
import { setupProjectSelection } from "./setupEventListeners";
import createProject from "./createProject";

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
    const isAllTodos = defaultProject.name === "All Todos"; // check if current default is All Todos.

    const defaultHeader = document.createElement("div"); // added div to hold header and delete button.
    defaultHeader.classList.add("default-header");

    const defaultTitle = document.createElement("h2");
    defaultTitle.textContent = defaultProject.name;
    defaultHeader.appendChild(defaultTitle);

    if (!isAllTodos) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-project-button");

        // Event listener to delete the current default project
        deleteButton.addEventListener("click", () => {
            AppController.deleteProject(defaultProject.name);
            renderProjects(AppController.getAllProjects()); // Re-render project list
            renderDefaultProject(); // Re-render default container to show "All Todos"
        });

        defaultHeader.appendChild(deleteButton);
    }

    container.appendChild(defaultHeader);

    const todoList = document.createElement("ul"); // create empty list to put todos.
    todoList.classList.add("todo-list");

    let todos = isAllTodos ? AppController.getAllTodos() : defaultProject.getTodos(); // conditionally grab todos depending on whether All or another project.

    if (todos.length === 0 && isAllTodos) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Get started by creating a project!";
        emptyMessage.classList.add("empty-message");
        container.appendChild(emptyMessage);
    } else { 
        todos.sort((a, b) => a.completed - b.completed).forEach(todo => { // everything created here will be attached to each todo item.
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
        if (isAllTodos) {
            // Grey out and disable delete button if "All Todos" is the default project
            deleteButton.disabled = true;
            deleteButton.style.opacity = "0.3"; // Grey out the button
            deleteButton.style.cursor = "not-allowed"; // Change cursor to indicate it's disabled
            deleteButton.style.backgroundColor = "grey";
        } else {
            deleteButton.addEventListener("click", () => {
                defaultProject.removeTodo(todo.title);
                renderDefaultProject();
            });
        };
        itemContainer.appendChild(deleteButton);



        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.fontSize = "10px";
        editButton.classList.add("edit-button");
        if (isAllTodos) {
            editButton.disabled = true;
            editButton.style.opacity = "0.3";
            editButton.style.cursor = "not-allowed";
            editButton.style.backgroundColor = "grey";
        } else {
            editButton.addEventListener("click", () => {
                openEditForm(todo, defaultProject.name);
            });
        }

        itemContainer.appendChild(editButton);

        todoItem.appendChild(itemContainer);

        if (todo.completed) {
            todoItem.classList.add("completed-todo");
        };

        todoList.appendChild(todoItem);

        });
    }

    container.appendChild(todoList);

    setupProjectSelection();
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
    titleInput.required = true;
    todoForm.appendChild(titleInput);

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.name = "description";
    descriptionInput.placeholder = "Description";
    todoForm.appendChild(descriptionInput);

    const selectProjectInput = document.createElement("select");
    selectProjectInput.name = "project";
    selectProjectInput.required = true;

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a project";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectProjectInput.appendChild(placeholderOption);

    const projects = AppController.getAllProjects().filter(project => project.name !== "All Todos");
    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project.name;
        option.textContent = project.name;
        selectProjectInput.appendChild(option);
    });
    todoForm.appendChild(selectProjectInput);

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

    const formContainer = document.querySelector(selector);

    if (visible && formContainer) {
        formContainer.style.display = "block";
        document.addEventListener("keydown", handleEscKey);
    } else {
        document.removeEventListener("keydown", handleEscKey);
        if (!formContainer) {
            console.error(`Element with selector "${selector}" not found.`);
        }
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
    const todoForm = document.querySelector(".todo-form");

    // Show the form
    toggleForm(".todo-form-container", true);

    // Populate the form with the todo's current details
    todoForm.title.value = todo.title;
    todoForm.description.value = todo.description;
    todoForm.priority.value = todo.priority;
    todoForm.dueDate.value = todo.dueDate;

    // Populate the project dropdown and preselect the current project
    const projectSelector = todoForm.querySelector("select[name='project']");
    projectSelector.innerHTML = ""; // Clear existing options

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a project";
    placeholderOption.disabled = true;
    projectSelector.appendChild(placeholderOption);

    // Get all projects except "All Todos" and populate the dropdown
    const projects = AppController.getAllProjects().filter(proj => proj.name !== "All Todos");
    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project.name;
        option.textContent = project.name;

        // Set the option as selected if it matches the todo's current project
        if (project.name === projectName) {
            option.selected = true;
        }

        projectSelector.appendChild(option);
    });

    // Set the form in edit mode
    todoForm.dataset.editing = "true";
    todoForm.dataset.todoTitle = todo.title;
    todoForm.dataset.originalProject = projectName; // Set original project name here
}



function renderFilteredTodos(todos, query) {
    const container = document.querySelector(".default-container");
    container.innerHTML = ""; // Clear current contents

    const title = document.createElement("h2");
    title.textContent = "Search results:";
    container.appendChild(title);

    const todoList = document.createElement("ul");
    todoList.classList.add("todo-list");

    todos.forEach(todo => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        const itemContainer = document.createElement("div");
        itemContainer.classList.add("list-item-container");

        // Highlight the query within the title
        const itemTitle = document.createElement("span");
        itemTitle.classList.add("item-title");

        const title = todo.title;
        const lowerCaseTitle = title.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();

        const startIndex = lowerCaseTitle.indexOf(lowerCaseQuery);
        if (startIndex !== -1) {
            const beforeMatch = title.slice(0, startIndex);
            const matchText = title.slice(startIndex, startIndex + query.length);
            const afterMatch = title.slice(startIndex + query.length);
            itemTitle.innerHTML = `${beforeMatch}<span class="highlight">${matchText}</span>${afterMatch}`;
        } else {
            itemTitle.textContent = title;
        }

        itemContainer.appendChild(itemTitle);    

        // Add due date
        const dueDateSpan = document.createElement("span");
        dueDateSpan.classList.add("todo-date");
        dueDateSpan.textContent = `Due: ${todo.dueDate}`;
        itemContainer.appendChild(dueDateSpan);

        // Add priority indicator
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

        // Add delete button with functionality
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            AppController.deleteTodo(todo.title);
            renderFilteredTodos(todos.filter(t => t.title !== todo.title), query); // Refresh filtered list without deleted todo
        });
        itemContainer.appendChild(deleteButton);

        // Add edit button with functionality
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            const projectName = AppController.getProjectNameForTodo(todo.title); // Get project name for the todo
            openEditForm(todo, projectName); // Adjust as needed to pass the project name
        });
        itemContainer.appendChild(editButton);

        todoItem.appendChild(itemContainer);
        todoList.appendChild(todoItem);
    });


    container.appendChild(todoList);
}


export {
    renderProjects, 
    renderTodoForm, 
    toggleForm, 
    renderProjectForm, 
    renderDefaultProject, 
    openEditForm,
    renderFilteredTodos
};