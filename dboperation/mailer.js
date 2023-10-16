const sgMail = require("@sendgrid/mail");
const config = require("../node_modules/config");
sgMail.setApiKey(config.get("sendgridkey"));
const sendEmail = (email, username) => {
  const msg = {
    to: email, // Change to your recipient
    from: "barmeteam@gmail.com", // Change to your verified sender
    subject: "New Request",
    text: `You have recived a new request from ${username}`,
    html: `<strong>You have recived a new request from ${username}</strong>`,
  };
  console.log("Mailed");
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = sendEmail;
