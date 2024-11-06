
// add event listeners here. start by adding add project button and add todo button.
import AppController from "./AppController";
import { renderProjects, renderTodoForm, toggleForm, renderProjectForm, renderDefaultProject } from "./domRenderer";
import createTodo from "./createTodo";
import createProject from "./createProject";

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
            // add completed here.
            
            const newTodo = createTodo(title, description, priority, dueDate, false);

            const defaultProject = AppController.getDefaultProject(); // create default var for this block.
            defaultProject.addTodo(newTodo); // 
    
            toggleForm(".todo-form-container", false); // hides form
            event.target.reset();
            renderDefaultProject();
        });

        const createProjectButton = document.querySelector(".create-project");
        const submitProjectForm = document.querySelector(".project-form");
    
        createProjectButton.addEventListener("click", () => {
            toggleForm(".project-form-container", true);
        });

        submitProjectForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = event.target.projectTitle.value;
            createProject(name);
            
            toggleForm(".project-form-container", false);
            event.target.reset();

            renderProjects(AppController.getAllProjects());
        })
}

function setupProjectSelection() {
    const projectElements = document.querySelectorAll(".project"); // Assuming .project is the class for each project

    projectElements.forEach(projectElement => {
        projectElement.addEventListener("click", () => {
            const projectName = projectElement.querySelector("h5").textContent; // Assuming <h2> holds the project name

            if (AppController.setDefaultProject(projectName)) {
                renderDefaultProject(); // Re-render todos in default container
            } else {
                console.error(`Project "${projectName}" not found`);
            }
        });
    });
}

export { setupEventListeners, setupProjectSelection };

