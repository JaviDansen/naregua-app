const express = require('express');
const router = express.Router();

const pool = require('../db');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const {
    nome,
    email,
    senha,
    telefone,
    perfil = 'usuario'
  } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'nome, email e senha são obrigatórios'
      });
    }

    if (perfil === 'usuario' && (!telefone || telefone.trim() === '')) {
      return res.status(400).json({
        erro: 'telefone é obrigatório para clientes'
      });
    }

    if (!['usuario', 'admin'].includes(perfil)) {
      return res.status(400).json({
        erro: 'perfil inválido'
      });
    }

    const usuarioExistente = await pool.query(
      `SELECT id FROM usuarios WHERE email = $1`,
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        erro: 'Email já cadastrado'
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios
       (nome, email, senha, telefone, perfil)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, email, telefone, perfil`,
      [nome, email, senhaHash, telefone || null, perfil]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      dados: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no POST /register:', error);

    return res.status(500).json({
      erro: 'Erro ao cadastrar usuário'
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(400).json({
        erro: 'email e senha são obrigatórios'
      });
    }

    const result = await pool.query(
      `SELECT id, nome, email, senha, perfil
       FROM usuarios
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      dados: {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
      }
    });
  } catch (error) {
    console.error('Erro no POST /login:', error);
    return res.status(500).json({
      erro: 'Erro ao realizar login'
    });
  }
});

router.get(
  '/users',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem visualizar usuários.'),
  async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, email
       FROM usuarios`
    );

    return res.status(200).json({
      dados: result.rows
    });
  } catch (error) {
    console.error('Erro no GET /users:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar usuários'
    });
  }
});

module.exports = router;