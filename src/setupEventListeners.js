
// add event listeners here. start by adding add project button and add todo button.
import AppController from "./appController";
import { renderProjects, renderTodoForm, toggleForm, renderProjectForm} from "./domRenderer";
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
            AppController.addTodoToProject(newTodo, "All Todos");
    
            toggleForm(".todo-form-container", false); // hides form
            event.target.reset();
    
            renderProjects(AppController.getAllProjects()); // rerenders with the added info.
    
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

export { setupEventListeners };

