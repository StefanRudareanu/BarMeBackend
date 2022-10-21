const express = require("express");
const router = express.Router();
const Invitaion = require("../dboperation/EventInvitation");
const protector = require("./routeprotector");
const EventInvitation = new Invitaion();
const user = require("./usercont");
const Users = user.instance;

router.post("/", protector, async (req, res) => {
  try {
    const user = await Users.GetUserData(req.body.reciver);
    console.log(user);
    if (user[0] == null) {
      res.status(400).send("Barman does not exist");
    }
    await EventInvitation.CreateInvitation(req.body);
    res.status(200).send({ msg: "data added to invite" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

router.get("/invitationbarman/:username", async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitaionsBarman(req.params.username);
    console.log(data[0]);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(200).send({ err: error.message });
  }
});
router.get("/invitationuser/:username", async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitationsUser(req.params.username);
    res.status(200).send({ data: data[0] });
  } catch (error) {
    res.status(400).send({ er: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await EventInvitation.DeleteInvitation(req.params.id);
    res.status(200).send("Invite deleted");
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
module.exports = router;
