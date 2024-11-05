// add event listeners here. start by adding add project button and add todo button.

import AppController from "./appController";
import { renderProjects, toggleTodoForm } from "./domRenderer";


function setupEventListeners() {
    document.querySelector(".create-todo").addEventListener("click", () => {
        toggleTodoForm(true);
    });

    document.querySelector(".todo-form").addEventListener("submit", (event) => {
        // clicking button on form same as submit event for form.
        event.preventDefault; // not sure if need yet.
        // on submit, the input attributes are usable. 

        const title = event.target.title.value;
        const description = event.target.description.value;
        const priority = event.target.description.value;
        const dueDate = event.target.description.value;
        // add completed here.
        
        const newTodo = createTodo(title, description, priority, dueDate, false);
        AppController.addTodoToProject(newTodo, "All Todos");

        toggleTodoForm(false); // hides form
        event.target.reset();

        renderProjects(AppController.getAllProjects()); // rerenders with the added info.

    })

    document.querySelector(".create-project").addEventListener("click", () => {

    });
}

export { setupEventListeners };