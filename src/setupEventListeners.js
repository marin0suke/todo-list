
// add event listeners here. start by adding add project button and add todo button.
import AppController from "./AppController";
import { renderProjects, renderTodoForm, toggleForm, renderProjectForm, renderDefaultProject, renderFilteredTodos } from "./domRenderer";
import createTodo from "./createTodo";

function setupEventListeners() {
    renderTodoForm(); // make sure the form is rendered in the DOM so accessible.
    renderProjectForm();  

    const createTodoButton = document.querySelector(".create-todo"); // should this be in DOM renderer instead? oops
    const submitTodoForm = document.querySelector(".todo-form");

    createTodoButton.addEventListener("click", () => {
        toggleForm(".todo-form-container", true);
    });

    submitTodoForm.addEventListener("submit", (event) => {
        // clicking button on form same as submit event for form.
        event.preventDefault(); // not sure if need yet.
        // on submit, the input attributes are usable. 

        const title = event.target.title.value;
        const description = event.target.description.value;
        const priority = event.target.priority.value;
        const dueDate = event.target.dueDate.value;
        // const projectName = submitTodoForm.dataset.projectName; // used for editing within the project (this gets deleted)
        const selectedProject = event.target.project.value; // taken from the form input.
        const originalProject = submitTodoForm.dataset.originalProject; // track for editing mode.
        
        if (submitTodoForm.dataset.editing === "true") {
            // Edit mode: Update the existing todo
            const todoTitle = submitTodoForm.dataset.todoTitle;

            console.log("Editing todo:", todoTitle);
            console.log("Original project:", originalProject, "New project:", selectedProject);


            if (originalProject !== selectedProject) {
                const moveSuccess = AppController.moveTodoBetweenProjects(todoTitle, originalProject, selectedProject);
                if (moveSuccess) {
                    console.log("Successfully moved todo to new project.");
                } else {
                    console.error("Failed to move todo to new project.");
                }
            }

            const editSuccess = AppController.editTodoInProject(todoTitle, selectedProject, {
                title,
                description,
                priority,
                dueDate,
            });
            
            if (editSuccess) {
                renderDefaultProject(); // Re-render the updated project after editing
            } else {
                console.error("Failed to edit the todo.");
            }

            // Clear edit mode
            delete submitTodoForm.dataset.editing;
            delete submitTodoForm.dataset.todoTitle;
            delete submitTodoForm.dataset.originalProject;

            AppController.setDefaultProject(originalProject); // if we are editing, the default project doesn't change from view.
            renderDefaultProject();

        } else {
            // Create mode: Add a new todo
            const newTodo = createTodo(title, description, priority, dueDate, false);
            AppController.addTodoToProject(newTodo, selectedProject);
            AppController.setDefaultProject(selectedProject);
            AppController.getDefaultProject();
        }

        toggleForm(".todo-form-container", false); // hides form
        event.target.reset();
        renderDefaultProject(); // shows added todo in default container straight away.
    });

    const createProjectButton = document.querySelector(".create-project");
    const submitProjectForm = document.querySelector(".project-form");

    createProjectButton.addEventListener("click", () => {
        toggleForm(".project-form-container", true);
    });

    submitProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = event.target.projectTitle.value;

        if (name) {
            AppController.addProject(name);

            toggleForm(".project-form-container", false);
            event.target.reset();

            renderProjects(AppController.getAllProjects());
        } else {
            console.error("Failed to create new project");
        }
    });
}

function setupSearch() {
    const searchInput = document.querySelector("#search-bar"); // Select the search input here
    if (!searchInput) {
        console.error("Search input element not found.");
        return;
    }
    
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        if (query === "") {
            // If the search bar is cleared, show the default project view
            renderDefaultProject();
        } else {
            // Otherwise, perform the search and show filtered results
            const filteredTodos = AppController.handleSearch(query);
            renderFilteredTodos(filteredTodos, query);
        }
    });
}

function setupProjectSelection() {
    const projectElements = document.querySelectorAll(".project"); // Assuming .project is the class for each project

    projectElements.forEach(projectElement => {
        projectElement.removeEventListener("click", handleProjectClick); // removes existing so no double ups.
        projectElement.addEventListener("click", handleProjectClick);
    });
}

function handleProjectClick(event) {
    const projectName = event.currentTarget.querySelector("h5").textContent;

    if (AppController.setDefaultProject(projectName)) {
        renderDefaultProject(); // Re-render todos in default container
    } else {
        console.error(`Project "${projectName}" not found`);
    }
}

export { setupEventListeners, setupProjectSelection, setupSearch };

