const express = require('express');
const router = express.Router();

const pool = require('../db');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nome,
        especialidade
      FROM funcionarios
      ORDER BY nome ASC
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

router.get(
  '/employees/admin',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem visualizar dados completos dos funcionários.'),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          id,
          nome,
          especialidade,
          telefone
        FROM funcionarios
        ORDER BY nome ASC
      `);

      return res.status(200).json({
        dados: result.rows
      });
    } catch (error) {
      console.error('Erro no GET /employees/admin:', error.message);
      return res.status(500).json({
        erro: 'Erro ao buscar funcionários para administração'
      });
    }
  }
);

router.post(
  '/employees',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem cadastrar funcionários.'),
  async (req, res) => {
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
          'YYYY-MM-DD"T"HH24:MI:SS'
        ) || '-03:00' AS criado_em`,
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

router.put(
  '/employees/:id',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem editar funcionários.'),
  async (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, telefone } = req.body;

    try {
      if (isNaN(Number(id))) {
        return res.status(400).json({
          erro: 'ID do funcionário inválido. Informe um identificador numérico válido.'
        });
      }

      if (!nome || !especialidade || !telefone) {
        return res.status(400).json({
          erro: 'Os campos nome, especialidade e telefone são obrigatórios para editar um funcionário.'
        });
      }

      const funcionarioExistente = await pool.query(
        `SELECT id FROM funcionarios WHERE id = $1`,
        [id]
      );

      if (funcionarioExistente.rows.length === 0) {
        return res.status(404).json({
          erro: 'Funcionário não encontrado para o ID informado.'
        });
      }

      const result = await pool.query(
      `UPDATE funcionarios
        SET nome = $1, especialidade = $2, telefone = $3
        WHERE id = $4
        RETURNING
          id,
          nome,
          especialidade,
          telefone,
          TO_CHAR(
            criado_em AT TIME ZONE 'America/Sao_Paulo',
            'YYYY-MM-DD"T"HH24:MI:SS'
          ) || '-03:00' AS criado_em`,
        [nome, especialidade, telefone, id]
      );

      return res.status(200).json({
        mensagem: 'Funcionário atualizado com sucesso.',
        dados: result.rows[0]
      });
    } catch (error) {
      console.error('Erro no PUT /employees/:id:', error.message);
      return res.status(500).json({
        erro: 'Erro ao atualizar funcionário. Verifique os dados enviados e tente novamente.'
      });
    }
  }
);

module.exports = router;