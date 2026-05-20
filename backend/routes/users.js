const express = require('express');
const router = express.Router();

const pool = require('../db');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário no sistema. Senhas devem ter no mínimo 8 caracteres.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único do usuário
 *                 example: joao@example.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha com no mínimo 8 caracteres
 *                 example: senha123456
 *               telefone:
 *                 type: string
 *                 description: Número de telefone (obrigatório para clientes)
 *                 example: "11987654321"
 *               perfil:
 *                 type: string
 *                 enum: [usuario, admin]
 *                 default: usuario
 *                 description: Papel do usuário no sistema
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário cadastrado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     perfil:
 *                       type: string
 *       400:
 *         description: Dados inválidos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "nome, email e senha são obrigatórios"
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Email já cadastrado"
 *       500:
 *         description: Erro interno do servidor
 */
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

    if (senha.trim().length < 8) {
      return res.status(400).json({
        erro: 'A senha deve ter no mínimo 8 caracteres'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

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
      [emailNormalizado]
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
       RETURNING id, nome, email, perfil`,
      [
        nome.trim(),
        emailNormalizado,
        senhaHash,
        telefone ? telefone.trim() : null,
        perfil
      ]
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Fazer login
 *     description: Autentica um usuário e retorna um token JWT válido por 1 hora
 *     tags:
 *       - Autenticação
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário cadastrado
 *                 example: joao@example.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: senha123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 dados:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT para usar em requisições autenticadas
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         perfil:
 *                           type: string
 *       400:
 *         description: Email ou senha não fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "email e senha são obrigatórios"
 *       401:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Email ou senha inválidos"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(400).json({
        erro: 'email e senha são obrigatórios'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, nome, email, senha, perfil
       FROM usuarios
       WHERE email = $1`,
      [emailNormalizado]
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

router.get('/profile', auth, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({
        erro: 'Usuário autenticado não identificado'
      });
    }

    const result = await pool.query(
      `SELECT id, nome, email, perfil, telefone
       FROM usuarios
       WHERE id = $1`,
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no GET /profile:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar perfil do usuário'
    });
  }
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Não autenticado
 */

router.get(
  '/users',
  auth,
  authorize('admin', 'Acesso negado. Apenas administradores podem visualizar usuários.'),
  async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, email, telefone
      FROM usuarios
      WHERE perfil = 'usuario'
      ORDER BY nome ASC`
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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários do tipo cliente (admin)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */

router.put('/profile', auth, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { nome, telefone } = req.body;

    if (!usuarioId) {
      return res.status(401).json({
        erro: 'Usuário autenticado não identificado'
      });
    }

    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        erro: 'nome é obrigatório'
      });
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET nome = $1, telefone = $2
       WHERE id = $3
       RETURNING id, nome, email, perfil, telefone`,
      [nome.trim(), telefone ? telefone.trim() : null, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no PUT /profile:', error.message);
    return res.status(500).json({
      erro: 'Erro ao atualizar perfil do usuário'
    });
  }
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */

module.exports = router;