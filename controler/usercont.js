const express = require("../node_modules/express");
const router = express.Router();
const User = require("../dboperation/user");
const bcrypt = require("../node_modules/bcrypt");
const UserS = new User();
const protector = require("./routeprotector");
const jwt = require("jsonwebtoken");
const config = require("../node_modules/config");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = req.body.password;
    req.body.password = await bcrypt.hash(password, salt);
    await UserS.CreateUser(req.body);
    res.status(200).send({ res: "User added" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    let user = await UserS.VeirfyUser(req.body.email);
    if (!user) res.status(400).send({ data: "Invalid Email or Password" });
    let decode = await bcrypt.compare(req.body.password, user[0].password);
    if (!decode) res.status(400).send({ data: "Invalid Email or Password" });
    let token = user[0].genAuthToken();
    const tdata = jwt.verify(token, config.get("authtoken"));
    const username = tdata.username;
    const type = tdata.type;
    res.status(200).send({ token: token, username: username, type: type });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/location/:city", async (req, res) => {
  try {
    let data = await UserS.GetUSerProfile(req.params.city);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

module.exports = router;
