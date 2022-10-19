const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const usercont = require("./controler/usercont");
const app = express();
const config = require("config");
const jwt = require("jsonwebtoken");
const invitecont = require("./controler/invitationcont");
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/users", usercont.router);
app.use("/api/event", invitecont);
app.listen(4000, () => {
  console.log("Listening on 4000");
});
