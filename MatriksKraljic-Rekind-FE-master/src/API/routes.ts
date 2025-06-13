const mainRoute = process.env.NEXT_PUBLIC_API_URL;

//groups
const projectsRoute = `${mainRoute}/api/projects`;

//tasks
const tasksRoute = `${mainRoute}/api/task`;

//kraljic
const kraljicRoute = `${mainRoute}/api/kraljic`;

export const apiRoutes = {
  main: mainRoute,
  projects: {
    main: projectsRoute
  },
  tasks: {
    main: tasksRoute,
    byId: (projectid: number) => `${tasksRoute}/${projectid}`,
    details: (taskid: number) => `${tasksRoute}/${taskid}/details`
  },
  kraljic: {
    main: kraljicRoute,
    byId: (taskid: number) =>   `${kraljicRoute}/${taskid}`,
    all: (projectid: number) => `${kraljicRoute}/SupplyAndBusiness/${projectid}`
  }
};
