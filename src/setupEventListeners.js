
// add event listeners here. start by adding add project button and add todo button.
import AppController from "./appController";
import { renderProjects, renderTodoForm, toggleTodoForm } from "./domRenderer";
import createTodo from "./createTodo";

function setupEventListeners() {
        renderTodoForm(); // make sure the form is rendered in the DOM so accessible.

        const createTodoButton = document.querySelector(".create-todo"); // should this be in DOM renderer instead? oops
        const submitForm = document.querySelector(".todo-form");

        createTodoButton.addEventListener("click", () => {
            toggleTodoForm(true);
        });
    
        submitForm.addEventListener("submit", (event) => {
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
    
            toggleTodoForm(false); // hides form
            event.target.reset();
    
            renderProjects(AppController.getAllProjects()); // rerenders with the added info.
    
        });

        const createProjectButton = document.querySelector(".create-project");
    
        createProjectButton.addEventListener("click", () => {
            
        });
}

export { setupEventListeners };

