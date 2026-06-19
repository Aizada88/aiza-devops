const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  host: 'database-1.c1w8u6wa64t2.us-east-2.rds.amazonaws.com',
  user: 'postgres',
  password: 'wuK:umjKWi:2e$!DjongMwHv5NK6',
  database: 'postgres',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Backend Service Running');
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database Connected Successfully',
      database_time: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
`});
