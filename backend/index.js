const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API Barbearia rodando 🚀');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});