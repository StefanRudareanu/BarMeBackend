const express = require("express");
const router = express.Router();
const Invitaion = require("../dboperation/EventInvitation");
const protector = require("./routeprotector");
const EventInvitation = new Invitaion();

router.post("/", protector, async (req, res) => {
  try {
    await EventInvitation.CreateInvitation(req.body);
    res.status(200).send({ msg: "data added to invite" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
module.exports = router;
router.get("/invitationbarman", async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitaionsBarman(req.body.username);
    res.status(200).send({ data: data[0] });
  } catch (error) {
    res.status(200).send({ err: error.message });
  }
});
router.get("/invitationuser", async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitationsUser(req.body.username);
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
