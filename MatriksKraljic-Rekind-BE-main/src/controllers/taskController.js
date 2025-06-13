import pool from '../config/db.js';
import { getAllTasksQuery, getTasksByProjectCodeQuery,
  getTaskDetailsQuery,
  createTaskQuery, checkRequisitionNoExistsQuery
 } from '../queries/taskQueries.js';

// Function to get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const { rows } = await pool.query(getAllTasksQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Create a new task
// export const createTask = async (req, res) => {
//   const { projectid, status, requisitionno, sowdesc, discipline, procurement } = req.body;

//   try {
//     const result = await pool.query(createTaskQuery, [
//       projectid,
//       status,
//       requisitionno,
//       sowdesc,
//       discipline,
//       procurement,
//     ]);

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error creating task:", error.message);
//     res.status(500).json({ message: "Failed to create task" });
//   }
// };

// Function to get tasks by project code
export const getTasksByProjectCode = async (req, res) => {
  const { projectid } = req.params;

  try {
    const { rows } = await pool.query(getTasksByProjectCodeQuery, [projectid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this project code' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tasks by project code:', error.message);
    res.status(500).json({ message: 'Failed to fetch tasks by project code' });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const { projectid } = req.params;

    // Eksekusi query
    const result = await pool.query(getTaskDetailsQuery, [projectid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Kirim hasil data ke response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create New Task
export const createTask = async (req, res) => {
  const { projectid, requisitionno, sowdesc, discipline, procurement } = req.body;

  try {
    // Check if requisition number already exists
    const { rowCount } = await pool.query(checkRequisitionNoExistsQuery, [requisitionno]);
    if (rowCount > 0) {
      return res.status(400).json({ message: "Requisition number already exists" });
    }

    // Create new task
    const { rows } = await pool.query(createTaskQuery, [projectid, requisitionno, sowdesc, discipline, procurement]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({ message: "Failed to create task" });
  }
};