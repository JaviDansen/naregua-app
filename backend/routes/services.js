const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

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

router.post(
  '/services',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem cadastrar serviços.'),
  async (req, res) => {
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

router.put(
  '/services/:id',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem editar serviços.'),
  async (req, res) => {
    const { id } = req.params;
    const { nome, preco, duracao } = req.body;

    try {
      if (isNaN(Number(id))) {
        return res.status(400).json({
          erro: 'ID do serviço inválido. Informe um identificador numérico válido.'
        });
      }

      if (!nome || preco == null || duracao == null) {
        return res.status(400).json({
          erro: 'Os campos nome, preco e duracao são obrigatórios para editar um serviço.'
        });
      }

      const servicoExistente = await pool.query(
        `SELECT id FROM servicos WHERE id = $1`,
        [id]
      );

      if (servicoExistente.rows.length === 0) {
        return res.status(404).json({
          erro: 'Serviço não encontrado para o ID informado.'
        });
      }

      const result = await pool.query(
        `UPDATE servicos
         SET nome = $1, preco = $2, duracao = $3
         WHERE id = $4
         RETURNING id, nome, preco, duracao`,
        [nome, preco, duracao, id]
      );

      return res.status(200).json({
        mensagem: 'Serviço atualizado com sucesso.',
        dados: result.rows[0]
      });
    } catch (error) {
      console.error('Erro no PUT /services/:id:', error.message);
      return res.status(500).json({
        erro: 'Erro ao atualizar serviço. Verifique os dados enviados e tente novamente.'
      });
    }
  }
);

module.exports = router;