// server/server.js - Express Server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
const PORT = 3001; // React runs on 3000, API runs on 3001

// Database Connection Pool (Replace with your actual credentials)
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'scholar_match_db',
    password: 'your_password',
    port: 5432,
});

app.use(cors()); // Allow React to connect
app.use(bodyParser.json());

// --- Core API Endpoint: Submit UAP and Get Matches ---
app.post('/api/profile/submit', async (req, res) => {
    const { full_name, email, academic_level, residence_state, annual_income_lpa } = req.body;
    
    // 1. Save UAP data to PostgreSQL
    try {
        const result = await pool.query(
            `INSERT INTO users (full_name, email, academic_level, residence_state, annual_income_lpa) 
             VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
            [full_name, email, academic_level, residence_state, annual_income_lpa]
        );
        const userId = result.rows[0].user_id;
        
        // 2. Call the Python AI Engine to get matches
        const pythonMatchServiceURL = 'http://localhost:5000/match';
        
        // Send the complete UAP data to the Python service
        const pythonResponse = await fetch(pythonMatchServiceURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uap_data: req.body })
        });
        
        const matchData = await pythonResponse.json();

        // 3. Respond with matches and new User ID
        res.status(201).json({ 
            message: "Profile submitted and matches generated.",
            userId,
            matches: matchData.matches || []
        });

    } catch (err) {
        console.error('Database or AI service error:', err);
        res.status(500).json({ error: 'Failed to process profile or get matches.' });
    }
});

// --- Simple Endpoint: Get all scholarships (for backend use or listing) ---
app.get('/api/scholarships', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM scholarships');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching scholarships:', err);
        res.status(500).json({ error: 'Failed to fetch scholarship data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js API listening on port ${PORT}`);
});