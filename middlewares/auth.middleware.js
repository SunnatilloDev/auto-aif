const checkAdmin = (req, res, next) => {
  const { login, password } = req.headers;
  if (login === "sunnatillo@gmail.com" && password === "sudoaptupdate") {
    return next();
  }
  res.status(401).send({
    message: "You are not an admin",
  });
};

module.exports = { checkAdmin };
