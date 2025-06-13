import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import taskRouter from './src/routes/taskRoutes.js';
import projectRouter from "./src/routes/projectRoutes.js";
import kraljicRouter from "./src/routes/matrixRoutes.js";
import corsOptions from './src/config/corsConfig.js'; // Import CORS configuration

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(cors(corsOptions)); // Use CORS with configuration

// Routes
app.get('/', (req, res) => {
  res.send('Successful Connect BE');
});

// Use task routes
app.use('/api/task', taskRouter);
app.use("/api/projects", projectRouter); // Register project routes
app.use("/api/kraljic", kraljicRouter);

//For Development
// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

// Export the app
export default app;
