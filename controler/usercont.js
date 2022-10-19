const express = require("express");
const router = express.Router();
const User = require("../dboperation/user");
const bcrypt = require("bcrypt");
const UserS = new User();
const protector = require("./routeprotector");
const jwt = require("jsonwebtoken");
const config = require("config");

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
    const location = tdata.location;
    res.status(200).send({
      token: token,
      username: username,
      type: type,
      location: location,
    });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/location/:city", protector, async (req, res) => {
  try {
    let data = await UserS.GetUSerProfile(req.params.city);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.post("/photo/:username", protector, async (req, res) => {
  try {
    await UserS.UploadPhoto(req.body.file, req.params.username);
    res.status(200).send({ msg: "Photo added" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/:username", protector, async (req, res) => {
  try {
    const data = await UserS.GetUserData(req.params.username);
    res.status(200).send({ data: data[0] });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.patch("/:username", protector, async (req, res) => {
  try {
    await UserS.AddSpecialDrink(req.params.username, req.body.drinkname);
    res.status(200).send({ msg: "Drink updated" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.patch("rating/:username/:rating", protector, async (req, res) => {
  try {
    await AddSpecialDrink(req.params.username, req.params.rating);
    res.status(200).send({ msg: "Rating added" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get(
  "/allbarmans/:barmanusername/:location",
  protector,
  async (req, res) => {
    try {
      const data = await UserS.GetBarmanDataBarman(
        req.params.barmanusername,
        req.params.location
      );
      res.status(200).send({ data: data });
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  }
);
router.get("/allbarmansusers/:location", protector, async (req, res) => {
  try {
    const data = await UserS.GetBarmanDataUser(req.params.location);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/avaible", protector, (req, res) => {
  res.status(200).send("Good token");
});
module.exports.router = router;
module.exports.instance = UserS;
