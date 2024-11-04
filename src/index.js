import createToDo from "./createTodo.js";
import createProject from "./createProject.js";




const testTodo = createToDo("test");
console.log(testTodo);

const testProject = createProject("testproj");
console.log(testProject);

testProject.addTodo(testTodo);
console.log(testProject);

