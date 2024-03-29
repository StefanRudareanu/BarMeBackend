const jwt = require("jsonwebtoken");
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
          type: String,
          requied: true,
          maxlength: 10,
          minlength: 10,
        },
        type: { type: String, enum: ["barman", "user"], requied: true },
        profileImage: {
          type: String,
          default: " ",
        },
        rating: { type: Number, default: 0 },
        numberrating: { type: Number, default: 0 },
        specilaDrinks: {
          type: Array,
        },
      },
      { minimize: false }
    );
    this.Schema.methods.genAuthToken = function () {
      let data = {
        username: this.username,
        type: this.type,
        location: this.location,
      };
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
  async GetUserData(username) {
    return await this.Usermodel.find({ username: username }).select(
      "username  email phonenumber profileImage location rating specilaDrinks"
    );
  }
  async UploadPhoto(photo, username) {
    return await this.Usermodel.findOneAndUpdate(
      { username: username },
      {
        profileImage: photo,
      }
    );
  }
  async AddSpecialDrink(username, drink) {
    return await this.Usermodel.findOneAndUpdate(
      { username: username },
      {
        $push: { specilaDrinks: drink },
      }
    );
  }
  async GetBarmanDataBarman(barmanusername, location) {
    return await this.Usermodel.find({
      username: { $ne: barmanusername },
      type: "barman",
      location: location,
    }).select("username email phonenumber");
  }
  async GetBarmanDataUser(location) {
    return await this.Usermodel.find({
      location: location,
      type: "barman",
    }).select("username email phonenumber");
  }
  async GetBarmanByUsername(username) {
    return await this.Usermodel.find({ username: username, type: "barman" });
  }
  async AddRatimg(username, value) {
    const data = await this.GetBarmanByUsername(username);
    const numberrating = data[0].numberrating + 1;
    const rating = Math.round(data[0].rating + value / numberrating);
    console.log(data[0].numberrating, data[0].rating, value);
    return await this.Usermodel.findOneAndUpdate(
      { username: username, type: "barman" },
      {
        numberrating: numberrating,
        rating: rating,
      }
    );
  }
}

module.exports = User;
