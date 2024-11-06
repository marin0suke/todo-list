
import createProject from "./createProject";
import { renderDefaultProject } from "./domRenderer";
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

    function setDefaultProject(projectName) {
        const project = projects.find(p => p.name === projectName);
        if (project) {
            defaultProject = project; 
            return true; // successfully changed.
        } else {
            return false; // project not found.
        }
    }

    function getDefaultProject() {
        return defaultProject;
    }

    function editTodoInProject(todoTitle, projectName, updatedFields) {
        if (!projects || !projects.length) {
            console.error("Projects array is undefined or empty");
            return false;
        }
    
        const project = projects.find(p => p.name === projectName);
        if (!project) {
            console.error(`Project with name "${projectName}" not found.`);
            return false;
        }
    
        // Check if the todos array exists on the project
        if (!project.todos || !Array.isArray(project.todos)) {
            console.error(`The "todos" array is missing or not initialized in project "${projectName}".`);
            return false;
        }
    
        const todo = project.todos.find(todo => todo.title === todoTitle);
        if (!todo) {
            console.error(`Todo with title "${todoTitle}" not found in project "${projectName}".`);
            return false;
        }
    
        // Update the todo with the new values
        todo.editTodo(
            updatedFields.title,
            updatedFields.description,
            updatedFields.priority,
            updatedFields.dueDate
        );
        console.log("Todo successfully edited:", todo);
        return true; // Edit successful
    }
    
    

    function moveTodoBetweenProjects(todoTitle, sourceProjectName, targetProjectName) { // necessary to have this here since we are searching within projects array for the source and target.
        const sourceProject = projects.find(p => p.name === sourceProjectName);
        const targetProject = projects.find(p => p.name === targetProjectName);

        if (sourceProject && targetProject) {
            const todoIndex = sourceProject.todos.findIndex(todo => todo.title === todoTitle);
            if (todoIndex !== -1) {
                const [todo] = sourceProject.todos.splice(todoIndex, 1); // Remove the todo
                targetProject.addTodo(todo); // Add the todo to the target project
                return true;
            }
        } else {
            console.error("Todo or project not found");
            return false;
        }
    }

    function getProjectTodos(projectName) {
        const project = projects.find(p => p.name === projectName);
        return project ? project.getTodos() : []; // if project exists but is empty, doesn't return error. 
    };

    function getAllProjects() {
        return projects;
    }

    function getAllTodos() {
        return projects.flatMap(project => project.getTodos());
    }

    function deleteProject(projectName) {
        // Prevent deletion of "All Todos"
        if (projectName === "All Todos") {
            console.error("Cannot delete 'All Todos' project.");
            return false;
        }
    
        // Find the index of the project
        const projectIndex = projects.findIndex(p => p.name === projectName);
    
        if (projectIndex !== -1) {
            // Remove the project from the array
            const [deletedProject] = projects.splice(projectIndex, 1);
    
            // If the deleted project was the default, reset the default to "All Todos"
            if (defaultProject === deletedProject) {
                setDefaultProject("All Todos");
            }
            return true;
        } else {
            console.error(`Project "${projectName}" not found.`);
            return false;
        }
    }
    

    return {
        addProject,
        addTodoToProject,
        moveTodoBetweenProjects,
        getProjectTodos,
        getAllProjects,
        getDefaultProject,
        setDefaultProject,
        editTodoInProject,
        getAllTodos,
        deleteProject
    };

})();

export default AppController;