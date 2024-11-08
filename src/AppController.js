
import createProject from "./createProject";
import createTodo from "./createTodo";


const AppController = (() => {
    let projects = [];

    let defaultProject = createProject("All Todos"); 
    projects.push(defaultProject);


    function saveDataToLocalStorage() {
        const projectsData = projects.map(project => ({
            name: project.name,
            todos: project.getTodos().map(todo => ({
                title: todo.title,
                description: todo.description,
                priority: todo.priority,
                dueDate: todo.dueDate,
                completed: todo.completed,
            }))
        }));
        localStorage.setItem('projects', JSON.stringify(projectsData));
    }

    function loadDataFromLocalStorage() {
        const storedProjects = JSON.parse(localStorage.getItem('projects'));
        if (storedProjects) {
            projects = storedProjects.map(projectData => {
                const project = createProject(projectData.name);
                projectData.todos.forEach(todoData => {
                    const todo = createTodo(
                        todoData.title,
                        todoData.description,
                        todoData.priority,
                        todoData.dueDate,
                        todoData.completed
                    );
                    project.addTodo(todo);
                });
                return project;
            });
        }
    }

    function addProject(name) {
        const project = createProject(name);
        projects.push(project);
        setDefaultProject(name);
        saveDataToLocalStorage(); // **Modified: Save on add**
        return project;
    };
    

    function addTodoToProject(todo, projectName) {
        const project = projects.find(p => p.name === projectName);
        if (project) {
            project.addTodo(todo); // uses addTodo inside createProject to push todo to targeted project.
            saveDataToLocalStorage(); // **Modified: Save on add**
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

        saveDataToLocalStorage(); // **Modified: Save on add**
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
                saveDataToLocalStorage(); // **Modified: Save on add**
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
            saveDataToLocalStorage(); // **Modified: Save on add**
            return true;
        } else {
            console.error(`Project "${projectName}" not found.`);
            return false;
        }
    }

    function handleSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const todos = getAllTodos();
        return todos.filter(todo => 
            todo.title.toLowerCase().includes(normalizedQuery)
        );
    }

    function deleteTodo(todoTitle) {
        for (const project of projects) {
            if (project.hasTodo(todoTitle)) { // Check if the project has the todo
                const removedTodo = project.removeTodo(todoTitle);
                if (removedTodo) {
                    saveDataToLocalStorage(); // **Modified: Save on add**
                    console.log(`Todo "${todoTitle}" removed from project "${project.name}".`);
                    return true; // Stop after finding and deleting the todo
                }
            }
        }
        console.error(`Todo "${todoTitle}" not found in any project.`);
        return false; // Todo not found in any project
    }

    function getProjectNameForTodo(todoTitle) {
        const project = projects.find(p => p.hasTodo(todoTitle));
        return project ? project.name : null;
    }
    
    loadDataFromLocalStorage();

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
        deleteProject,
        handleSearch,
        deleteTodo,
        getProjectNameForTodo
    };

})();

export default AppController;