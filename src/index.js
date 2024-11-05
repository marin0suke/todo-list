import createTodo from "./createTodo.js";
import createProject from "./createProject.js";
import { moveTodosBetweenProjects } from "./projectUtils.js";
import AppController from "./appController.js";
import "./styles.css";
import { renderProjects } from "./domRenderer.js";
import { setupEventListeners } from "./setupEventListeners.js";

function initializeApp() {
    AppController.addProject("Chores");
    AppController.addProject("Uni");

    // Create and add some initial todos
    const cleanToilet = createTodo("Clean the toilet", "Deep clean the bathroom", "High", "2024-11-15", false);
    const buyHardDrive = createTodo("Buy hard drive", "Purchase a 1TB SSD", "Medium", "2024-11-20", false);

    AppController.addTodoToProject(cleanToilet, "Chores");
    AppController.addTodoToProject(buyHardDrive, "Chores");

    renderProjects(AppController.getAllProjects());
}

window.onload = () => {
    initializeApp();
    setupEventListeners();
}

