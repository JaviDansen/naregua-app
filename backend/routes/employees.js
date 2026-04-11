const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');

router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nome,
        especialidade,
        telefone,
        TO_CHAR(
          criado_em AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS criado_em
      FROM funcionarios
    `);

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /employees:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar funcionários'
    });
  }
});

router.post('/employees', auth, async (req, res) => {
  const { nome, especialidade, telefone } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO funcionarios (nome, especialidade, telefone)
       VALUES ($1, $2, $3)
       RETURNING
         id,
         nome,
         especialidade,
         telefone,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [nome, especialidade, telefone]
    );

    return res.status(201).json({
      mensagem: 'Funcionário criado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no POST /employees:', error.message);
    return res.status(500).json({
      erro: 'Erro ao criar funcionário'
    });
  }
});

module.exports = router;