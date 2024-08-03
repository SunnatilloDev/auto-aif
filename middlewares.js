let checkAdmin = (req, res, next) => {
    let { login, password } = req.headers;
    if (login == "sunnatillo" && password == "sudoaptupdate") {
        return next();
    }
    res.status(401).send({
        message: "You are not admin",
    });
};

module.exports = { checkAdmin };
