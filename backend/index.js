const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API Barbearia rodando 🚀');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

app.use(express.json());

app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  res.json({
    mensagem: 'Usuário cadastrado com sucesso',
    usuario: { nome, email }
  });
});