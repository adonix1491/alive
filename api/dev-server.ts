import app from './app';
import dotenv from 'dotenv';
import path from 'path';

// Load envs
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Local Dev Server running on http://localhost:${PORT}`);
    console.log(`👉 Test API at http://localhost:${PORT}/api/health`);
});
