const jwt = require("../node_modules/jsonwebtoken");
const ConnectionMongo = require("./connection");
const config = require("config");
class User extends ConnectionMongo {
  constructor() {
    super();
    this.Schema = this.mongoose.Schema(
      {
        username: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        location: { type: String, required: true, trim: true },
        phonenumber: {
          type: Number,
          requied: true,
          maxlength: 10,
          minlength: 10,
        },
        type: { type: String, enum: ["barman", "user"], requied: true },
        profileImage: {
          data: { type: Buffer },
          content: { type: String },
          default: {},
        },
        rating: { type: Number, default: 0 },
      },
      { minimize: false }
    );
    this.Schema.methods.genAuthToken = function () {
      let data = { username: this.username, type: this.type };
      let token = jwt.sign(data, config.get("authtoken"));
      return token;
    };
    this.Usermodel = this.mongoose.model("User", this.Schema);
  }

  async CreateUser(data) {
    return await new this.Usermodel(data).save();
  }
  async VeirfyUser(email) {
    return await this.Usermodel.find({ email: email });
  }
  async GetUSerProfile(city) {
    return await this.Usermodel.find({
      location: { $in: [city] },
      type: "barman",
    });
  }
}
module.exports = User;
