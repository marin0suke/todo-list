import createTodo from "./createTodo.js";
import AppController from "./AppController.js";
import "./styles.css";
import { renderDefaultProject, renderProjects } from "./domRenderer.js";
import { setupEventListeners, setupProjectSelection, setupSearch} from "./setupEventListeners.js";

function initializeApp() { // some dummy content, renders initial page.
    
    renderProjects(AppController.getAllProjects());
    setupProjectSelection();
    setupSearch();
    renderDefaultProject();
}

window.onload = () => { // conditionally runs block on whether window is loaded - event listeners don't run until elements are on the page. (avoid timing conflicts).
    initializeApp();
    setupEventListeners();
}

