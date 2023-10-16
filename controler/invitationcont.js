const express = require("express");
const router = express.Router();
const Invitaion = require("../dboperation/EventInvitation");
const protector = require("./routeprotector");
const EventInvitation = new Invitaion();
const user = require("./usercont");
const Users = user.instance;
const cron = require("../node_modules/node-cron");

const sendemail = require("../dboperation/mailer");
function determinedatestate(date) {
  const year = date.slice(0, 4);
  let month = date.slice(5, 7);
  const day = date.slice(8, 10);
  if (month[0] == "0") {
    month = month.slice(1, 2);
  }
  let DateAPI = new Date();
  const actualyear = DateAPI.getFullYear();
  let actualmonth = Number(DateAPI.getMonth()) + 1;
  const actualday = DateAPI.getDate();
  if (year < actualyear) {
    return false;
  } else {
    if (month < String(actualmonth)) {
      return false;
    } else {
      if (day < actualday) {
        return false;
      }
    }
  }
  return true;
}
router.post("/:username", protector, async (req, res) => {
  try {
    const user = await Users.GetUserData(req.body.reciver);
    if (user[0] == null) {
      res.status(400).send("Barman does not exist");
    } else {
      req.body.eventDate = req.body.eventDate.slice(0, 10);
      const status = determinedatestate(req.body.eventDate);
      if (status == true) {
        await EventInvitation.CreateInvitation(req.body);
        res.status(200).send({ msg: "data added to invite" });
        sendemail("stefanrudareanu24@gmail.com", req.body.sender);
      } else {
        res.status(400).send({ message: "invalid date" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ err: error.message });
  }
});

router.get("/invitationbarman/:username", protector, async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitaionsBarman(req.params.username);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(200).send({ err: error.message });
  }
});
router.get("/invitationuser/:username", protector, async (req, res) => {
  try {
    let data = await EventInvitation.GetInvitationsUser(req.params.username);
    res.status(200).send({ data: data[0] });
  } catch (error) {
    res.status(400).send({ er: error.message });
  }
});
router.delete("/:id", protector, async (req, res) => {
  try {
    await EventInvitation.DeleteInvitation(req.params.id);
    res.status(200).send("Invite deleted");
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.put("/:id/:state", protector, async (req, res) => {
  try {
    await EventInvitation.AcceptInvitation(req.params.id);
    res.status(200).send("Accepted Invite");
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/accepted/:username", protector, async (req, res) => {
  try {
    const data = await EventInvitation.GetAcceptedIvitation(
      req.params.username
    );
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.get("/rating/:username", protector, async (req, res) => {
  try {
    const data = await EventInvitation.GetRatingAwaitingInvitations(
      req.params.username
    );
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});
router.patch("/updaterating/:id", protector, async (req, res) => {
  try {
    await EventInvitation.RateInvitation(req.body.value, req.params.id);
    const data = await EventInvitation.res
      .status(200)
      .send({ message: "rated successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/recentevents/:username", async (req, res) => {
  try {
    const data = await EventInvitation.GetRecentEvents(req.params.username);
    res.status(200).send({ data: data });
  } catch (error) {}
});
router.get("/ratedeventsbarman/:username", protector, async (req, res) => {
  try {
    data = await EventInvitation.GetRatedEventsBarman(req.params.username);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
router.get("/requestedbarman/:username", protector, async (req, res) => {
  try {
    data = await EventInvitation.GetRequestsUser(req.params.username);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
cron.schedule("* * * * *", async function () {
  console.log("Scheduled");
  const data = await EventInvitation.GetAllAceptedInvites();
  console.log(data);
  data.forEach(async (e) => {
    if (determinedatestate(e.eventDate) == false) {
      await EventInvitation.UpdateExpiredEvent(e._id);
    }
  });
});

module.exports = router;
