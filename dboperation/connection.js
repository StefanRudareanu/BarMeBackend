class ConnectionMongo {
  constructor() {
    this.mongoose = require("mongoose");
    this.mongoose.connect("mongodb://127.0.0.1:27017/Barme").then(() => {
      console.log("connected to db");
    });
  }
}
module.exports = ConnectionMongo;
