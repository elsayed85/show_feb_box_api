import express from 'express';
import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebBoxApi.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// Initialize APIs
const showboxAPI = new ShowboxAPI();
const febboxAPI = new FebboxAPI();

// Middleware to handle JSON requests
app.use(express.json());

// Test endpoint to check if the API is up
app.get('/', (req, res) => {
    res.send('Showbox and Febbox API is working!');
});

app.get('/api/search/:type', async (req, res) => {
    const { type } = req.params || 'all';
    const { title, page = 1, pagelimit = 20 } = req.query;

    try {
        const results = await showboxAPI.search(title, type, page, pagelimit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get movie details with custom parameters
app.get('/api/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movieDetails = await showboxAPI.getMovieDetails(id);
        res.json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get show details with custom parameters
app.get('/api/show/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const showDetails = await showboxAPI.getShowDetails(id);
        res.json(showDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get FebBox ID for a movie or show
app.get('/api/febbox/id', async (req, res) => {
    const { id, type } = req.query;

    try {
        const febBoxId = await showboxAPI.getFebBoxId(id, type);
        res.json({ febBoxId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file list from Febbox with customizable parameters
app.get('/api/febbox/files/:shareKey', async (req, res) => {
    const { shareKey } = req.params;
    const { parent_id = 0 } = req.query;

    try {
        const files = await febboxAPI.getFileList(shareKey, parent_id);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get download links for a file with customizable quality parameters
app.get('/api/febbox/links/:shareKey/:fid', async (req, res) => {
    const { shareKey, fid } = req.params;

    try {
        const links = await febboxAPI.getLinks(shareKey, fid);
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
