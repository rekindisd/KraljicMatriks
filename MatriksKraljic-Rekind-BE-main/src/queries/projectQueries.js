export const getAllProjectsQuery = `
  SELECT * FROM project;
`;

export const getProjectByIdQuery = `
  SELECT * FROM project WHERE projectid = $1;
`;

export const createProjectQuery = `
  INSERT INTO project(
    projectcode, projectname, discipline, projectrole)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const deleteProjectByIdQuery = `
  DELETE FROM project WHERE projectid = $1
  RETURNING *;
`;