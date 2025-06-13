export const getAllTasksQuery = `
  SELECT * FROM tasklist WHERE projectid = $1;
`;

export const  getTasksByProjectCodeQuery = `
SELECT 
  tasklist.taskid,
  tasklist.status,
  tasklist.requisitionno,
  tasklist.sowdesc,
  tasklist.discipline,
  tasklist.procurement,
  kraljicvalue.category,
  kraljicvalue.method_output
FROM
  tasklist
LEFT JOIN
  kraljicvalue
ON
  tasklist.taskid = kraljicvalue.taskid
WHERE
  tasklist.projectid = $1
ORDER BY
  kraljicvalue.timestamp DESC;
`;

export const getTaskDetailsQuery = `
SELECT 
  project.projectname,
  project.projectcode,
  taskList.procurement,
  taskList.discipline,
  taskList.requisitionno,
  taskList.sowdesc AS scopeOfWork
FROM 
  project
JOIN 
  tasklist
ON 
  project.projectid = taskList.projectid
WHERE 
  tasklist.taskid = $1;
`;

export const updateTaskStatusQuery = `
  UPDATE tasklist
  SET status = 'success'
  WHERE taskid = $1;
`;

export const createTaskQuery = `
  INSERT INTO tasklist(
    projectid, requisitionno, sowdesc, discipline, procurement)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const checkRequisitionNoExistsQuery = `
  SELECT 1 FROM public.tasklist WHERE requisitionno = $1;
`;