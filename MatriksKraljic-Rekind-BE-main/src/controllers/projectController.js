import pool from "../config/db.js";
import { getAllProjectsQuery, getProjectByIdQuery,
  createProjectQuery,
  deleteProjectByIdQuery
 } from "../queries/projectQueries.js";

// Get All Projects
export const getAllProjects = async (req, res) => {
    try {
      const { rows } = await pool.query(getAllProjectsQuery);
      res.status(200).json(rows); // Mengembalikan data
    } catch (err) {
      console.error("Error fetching projects:", err.message);
      res.status(500).json({ message: "Failed to fetch projects" }); // Pastikan res tetap valid
    }
  };

// Get Project by ID
export const getProjectById = async (req, res) => {
  const { projectid } = req.params;

  try {
    const result = await pool.query(getProjectByIdQuery, [projectid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching project by ID:", error.message);
    res.status(500).json({ message: "Failed to fetch project by ID" });
  }
};

// Create New Project
export const createProject = async (req, res) => {
  const { projectcode, projectname, discipline, projectrole } = req.body;

  try {
    // Check if a project with the same details already exists
    const checkQuery = `
      SELECT * FROM project
      WHERE projectcode = $1 AND projectname = $2 AND discipline = $3 AND projectrole = $4;
    `;
    const checkResult = await pool.query(checkQuery, [projectcode, projectname, discipline, projectrole]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Project with the same details already exists" });
    }

    // Create new project
    const { rows } = await pool.query(createProjectQuery, [projectcode, projectname, discipline, projectrole]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Delete Project by ID
export const deleteProjectById = async (req, res) => {
  const { projectid } = req.params;

  try {
    const result = await pool.query(deleteProjectByIdQuery, [projectid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project by ID:", error.message);
    res.status(500).json({ message: "Failed to delete project by ID" });
  }
};