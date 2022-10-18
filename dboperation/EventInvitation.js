const ConnectionMongo = require("./connection");

class Invitation extends ConnectionMongo {
  constructor() {
    super();
    this.Schema = this.mongoose.Schema({
      eventDate: { type: String, required: true },
      eventPlace: { type: String, required: true },
      drinks: [{ type: String, required: true }],
      sender: { type: String, required: true, trim: true },
      reciver: { type: String, required: true, trim: true },
    });
    this.Schema.index({ sender: 1, reciver: 1 }, { unique: true });
    this.Invitaions = this.mongoose.model("Invitation", this.Schema);
  }
  async CreateInvitation(data) {
    return await new this.Invitaions(data).save();
  }
  async DeleteInvitation(id) {
    return await this.Invitaions.findByIdAndDelete({ _id: id });
  }
  async GetInvitaionsBarman(username) {
    return await this.Invitaions.find({ reciver: username });
  }
  async GetInvitationsUser(username) {
    return await this.Invitaions.find({ sender: username });
  }
}
module.exports = Invitation;
