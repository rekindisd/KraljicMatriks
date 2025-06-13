const corsOptions = {
  origin: [
    'matriks-kraljic-rekind-be-git-main-reihans-projects-39673775.vercel.app',
    'https://matriks-kraljic-rekind-fe-git-master-reihans-projects-39673775.vercel.app',
    'https://matriks-kraljic-rekind-fe.vercel.app',
    'https://kraljic-admin.vercel.app/',
  ], // allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

export default corsOptions;
