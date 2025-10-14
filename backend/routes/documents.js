const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.single('document'), async (req, res) => {
  const { user_id } = req.body;
  const file_url = req.file.path;
  const name = req.file.originalname;

  await pool.query(
    'INSERT INTO documents (user_id, name, file_url) VALUES ($1, $2, $3)',
    [user_id, name, file_url]
  );
  res.json({ message: 'Uploaded successfully' });
});

module.exports = router;
