
function authorize(role) {
    return (req, res, next) => {
        if (req.usuario.role !== role) {
            return res.status(403).json({ message: "Acesso negado" });
        }
        next();
    };
}

module.exports = authorize;