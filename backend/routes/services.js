const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');

router.get('/services', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, preco, duracao
       FROM servicos`
    );

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /services:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar serviços'
    });
  }
});

router.post('/services', auth, async (req, res) => {
  const { nome, preco, duracao } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO servicos (nome, preco, duracao)
       VALUES ($1, $2, $3)
       RETURNING id, nome, preco, duracao`,
      [nome, preco, duracao]
    );

    return res.status(201).json({
      mensagem: 'Serviço criado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no POST /services:', error.message);
    return res.status(500).json({
      erro: 'Erro ao criar serviço'
    });
  }
});

module.exports = router;