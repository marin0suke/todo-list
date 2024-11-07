import createTodo from "./createTodo.js";
import AppController from "./AppController.js";
import "./styles.css";
import { renderDefaultProject, renderProjects } from "./domRenderer.js";
import { setupEventListeners, setupProjectSelection, setupSearch} from "./setupEventListeners.js";

function initializeApp() { // some dummy content, renders initial page.
    AppController.addProject("Chores");
    AppController.addProject("Uni");

    const cleanToilet = createTodo("Clean the toilet", "Deep clean the bathroom", "High", "2024-11-15", false);
    const buyHardDrive = createTodo("Buy hard drive", "Purchase a 1TB SSD", "Medium", "2024-11-20", false);

    AppController.addTodoToProject(cleanToilet, "Chores");
    AppController.addTodoToProject(buyHardDrive, "Chores");

    renderProjects(AppController.getAllProjects());
    setupProjectSelection();
    setupSearch();
    renderDefaultProject();
}

window.onload = () => { // conditionally runs block on whether window is loaded - event listeners don't run until elements are on the page. (avoid timing conflicts).
    initializeApp();
    setupEventListeners();
}

