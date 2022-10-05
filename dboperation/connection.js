class ConnectionMongo {
  constructor() {
    this.mongoose = require("mongoose");
    this.mongoose.connect("mongodb://localhost:27017/Barme").then(() => {
      console.log("connected to db");
    });
  }
}
module.exports = ConnectionMongo;
