const jwt = require("jsonwebtoken");
const config = require("config");
const { token } = require("morgan");
const { decode } = require("punycode");

function RouteProtector(req, res, next) {
  token = req.header("auth-token");
  if (!token) res.status(400).send("No token Provided");
  try {
    let decoded = jwt.verify(token, config.get("authtoken"));
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}
module.exports = RouteProtector;
