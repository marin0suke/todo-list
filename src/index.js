import createTodo from "./createTodo.js";
import createProject from "./createProject.js";
import { moveTodosBetweenProjects } from "./projectUtils.js";

const cleanToilet = createTodo("clean toilet");
const buyHarddrive = createTodo("buy harddrive");

const chores = createProject("chores");

chores.addTodo(cleanToilet);
chores.addTodo(buyHarddrive);

const uni = createProject("uni");

console.log(chores.getTodos());

moveTodosBetweenProjects("buy harddrive", chores, uni);


console.log(uni.getTodos());
console.log(chores.getTodos());
