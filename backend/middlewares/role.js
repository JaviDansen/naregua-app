function authorize(perfil, mensagemErro = 'Acesso negado.') {
  return (req, res, next) => {
    if (req.usuario.perfil !== perfil) {
      return res.status(403).json({
        erro: mensagemErro
      });
    }

    next();
  };
}

module.exports = authorize;