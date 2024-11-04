
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


    return {
        addProject,

    };

})();