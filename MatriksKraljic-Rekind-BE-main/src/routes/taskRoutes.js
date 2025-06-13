import express from 'express';
import { getAllTasks, getTasksByProjectCode, getTaskDetails, createTask } from '../controllers/taskController.js';

const taskRouter = express.Router();

// Route to get all tasks
taskRouter.get('/', getAllTasks);

// Route to get tasks by project code
taskRouter.get('/:projectid', getTasksByProjectCode);
taskRouter.get("/:projectid/details", getTaskDetails);

//Post
taskRouter.post("/", createTask);

export default taskRouter;
