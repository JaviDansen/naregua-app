module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    mensagem: 'Function da Vercel funcionando'
  });
};