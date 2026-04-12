const express = require('express');
const router = express.Router();

const pool = require('../db');

router.get('/business-hours', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        day_of_week,
        open_time,
        close_time,
        is_closed
      FROM business_hours
      ORDER BY day_of_week ASC
    `);

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /business-hours:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar horários de funcionamento'
    });
  }
});

module.exports = router;