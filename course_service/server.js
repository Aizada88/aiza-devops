const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
}
});

app.get('/', (req, res) => {
  res.send('Course Service Running');
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      service: 'course-service',
      message: 'Course Service connected to PostgreSQL',
      database_time: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      service: 'course-service',
      error: err.message
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Course service running on port 3000');
});
