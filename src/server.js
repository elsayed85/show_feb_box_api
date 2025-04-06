import express from 'express';
import cors from 'cors'; // Import cors package
import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebBoxApi.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// OR manually set CORS headers if you don’t want to use `cors` package
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Middleware to handle JSON requests
app.use(express.json());

// Initialize APIs
const showboxAPI = new ShowboxAPI();
const febboxAPI = new FebboxAPI();

// Test endpoint
app.get('/', (req, res) => {
    res.send('Showbox and Febbox API is working!');
});

// Autocomplete endpoint
app.get('/api/autocomplete', async (req, res) => {
    const { keyword, pagelimit } = req.query;
    try {
        const results = await showboxAPI.getAutocomplete(keyword, pagelimit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
    const { type = 'all', title, page = 1, pagelimit = 20 } = req.query;
    try {
        const results = await showboxAPI.search(title, type, page, pagelimit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Movie details
app.get('/api/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movieDetails = await showboxAPI.getMovieDetails(id);
        res.json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show details
app.get('/api/show/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const showDetails = await showboxAPI.getShowDetails(id);
        res.json(showDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get FebBox ID
app.get('/api/febbox/id', async (req, res) => {
    const { id, type } = req.query;
    try {
        const febBoxId = await showboxAPI.getFebBoxId(id, type);
        res.json({ febBoxId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Febbox files
app.get('/api/febbox/files', async (req, res) => {
    const { shareKey, parent_id = 0 } = req.query;
    const cookie = req.headers['X-Auth-Cookie'] || NULL;
    try {
        const files = await febboxAPI._setAuthCookie(cookie).getFileList(shareKey, parent_id);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get download links
app.get('/api/febbox/links', async (req, res) => {
    const { shareKey, fid } = req.query;
    const cookie = req.headers['X-Auth-Cookie'];
    try {
        const links = await febboxAPI._setAuthCookie(cookie).getLinks(shareKey, fid);
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
