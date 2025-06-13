import { Router } from "express";
import { getAllProjects, getProjectById, createProject,
    deleteProjectById
 } from "../controllers/projectController.js";

const projectRouter = Router();

projectRouter.get("/", getAllProjects);
projectRouter.get("/:projectid", getProjectById);

//Post
projectRouter.post("/", createProject);

//Delete
projectRouter.delete("/:projectid", deleteProjectById);

export default projectRouter;
