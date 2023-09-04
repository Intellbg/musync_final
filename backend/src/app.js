import express from 'express'
import cors from 'cors'
import userRoutes from './routes/users.js';
import playlistRoutes from './routes/playlist.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});