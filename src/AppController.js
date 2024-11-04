
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
    }

    return {
        addProject,
        addTodoToProject,
    };

})();

export default AppController;