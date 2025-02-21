import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
 
const app = express();
const appPort = process.env.PORT || 5174;
 
// Convert ES module `__dirname` equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// Serve the static files from the Vite build
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));
 
// Serve `index.html` for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
 
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'Route not found',
    message: 'No Route or API Endpoint found',
  });
});
 
app.listen(appPort, () => {
  console.log(`Server listening on port ${appPort}`);
});