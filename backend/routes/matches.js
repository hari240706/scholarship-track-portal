const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');

router.post('/generate', async (req, res) => {
  const { user_id } = req.body;
  const user = (await pool.query('SELECT * FROM users WHERE id = $1', [user_id])).rows[0];
  const schemes = (await pool.query('SELECT * FROM scholarships')).rows;

  const matches = [];

  for (const scheme of schemes) {
    const response = await axios.post('http://localhost:5001/score', {
      user,
      scheme
    });

    const { confidence_score, gap_analysis } = response.data;

    await pool.query(
      'INSERT INTO matches (user_id, scholarship_id, confidence_score, gap_analysis) VALUES ($1, $2, $3, $4)',
      [user_id, scheme.id, confidence_score, gap_analysis]
    );

    matches.push({ scheme, confidence_score, gap_analysis });
  }

  res.json(matches);
});

module.exports = router;
