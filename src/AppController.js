
import createTodo from "./createTodo";
import createProject from "./createProject";
import { moveTodosBetweenProjects } from "./projectUtils";

const AppController = (() => {
    const projects = [];

    let defaultProject = createProject("All Todos"); 
    projects.push(defaultProject);

    function addProject(name) {
        const project = createProject(name);
        projects.push(project);
        return project;
    };

    function addTodoToProject(todo, projectName) {
        const project = projects.find(p => p.name === projectName);
        if (project) {
            project.addTodo(todo); // uses addTodo inside createProject to push todo to targeted project.
        } else {
            return {
                success: false,
                message: `${project.name} could not be found`
            };
        }
    };

    function getProjectTodos(projectName) {
        const project = projects.find(p => p.name === projectName);
        return project ? project.getTodos() : []; // if project exists but is empty, doesn't return error. 
    };

    function getAllProjects() {
        return projects;
    }

    return {
        addProject,
        addTodoToProject,
        getProjectTodos,
        getAllProjects
    };

})();

export default AppController;