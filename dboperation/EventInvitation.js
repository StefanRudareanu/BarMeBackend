const ConnectionMongo = require("./connection");

class Invitation extends ConnectionMongo {
  constructor() {
    super();
    this.Schema = this.mongoose.Schema(
      {
        eventDate: { type: String, required: true },
        eventPlace: { type: String, required: true },
        drinks: [{ type: String, required: true }],
        sender: { type: String, required: true, trim: true },
        reciver: { type: String, required: true, trim: true },
        inviteState: { type: String, default: "pending" },
        inviteRating: { type: Number, default: 0 },
      },
      { minimize: false }
    );
    this.Schema.index(
      { sender: 1, reciver: 1, eventDate: 1 },
      { unique: true }
    );
    this.Invitaions = this.mongoose.model("Invitation", this.Schema);
  }
  async CreateInvitation(data) {
    return await new this.Invitaions(data).save();
  }
  async DeleteInvitation(id) {
    return await this.Invitaions.findByIdAndDelete({ _id: id });
  }
  async GetInvitaionsBarman(username) {
    return await this.Invitaions.find({
      reciver: username,
      inviteState: "pending",
    });
  }
  async GetInvitationsUser(username) {
    return await this.Invitaions.find({ sender: username });
  }
  async AcceptInvitation(id) {
    return await this.Invitaions.findOneAndUpdate(
      { _id: id },
      {
        inviteState: "accepted",
      }
    );
  }
  async GetAcceptedIvitation(username) {
    return await this.Invitaions.find({
      reciver: username,
      inviteState: "accepted",
    });
  }
  async UpdateRatingInvitation(id, value) {
    return await this.Invitaions.findOneAndUpdate(
      { _id: id },
      { inviteRating: value }
    );
  }
  async GetRatingAwaitingInvitations(username) {
    return await this.Invitaions.find({
      sender: username,
      inviteState: "rating",
    });
  }
  async GetRatedEvents(username) {
    return await this.Invitaions.find({
      sender: username,
      inviteStae: "rated",
    });
  }
  async UpdateExpiredEvent(id) {
    return await this.Invitaions.findOneAndUpdate(
      { _id: id },
      { inviteState: "rating" }
    );
  }
  async GetRecentEvents(username) {
    return await this.Invitaions.find({
      reciver: username,
      inviteStae: "rated",
    });
  }

  async RateInvitation(rating, id) {
    return await this.Invitaions.findOneAndUpdate(
      { _id: id },
      {
        inviteState: "rated",
        inviteRating: rating,
      }
    );
  }
  async GetAllAceptedInvites() {
    return await this.Invitaions.find({ inviteState: "accepted" });
  }
  async GetRatedEventsBarman(username) {
    return await this.Invitaions.find({
      inviteState: "rated",
      inviteRating: { $ne: 0 },
      reciver: username,
    });
  }
  async GetRequestsUser(username) {
    return await this.Invitaions.find({
      inviteState: "accepted",
      sender: username,
    });
  }
}
module.exports = Invitation;
