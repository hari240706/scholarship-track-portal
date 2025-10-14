const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/register', async (req, res) => {
  const { name, email, password, state, category, academic_level, field_of_study } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, state, category, academic_level, field_of_study) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, email, hash, state, category, academic_level, field_of_study]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
