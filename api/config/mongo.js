const mongoose = require("mongoose");

const mongoDB = () => {
  mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => {
      console.log("Mongo connected");
    })
    .catch((err) => {
      console.log("🚀 ~ file: mongoDB.js:10 ~ connect ~ err:", err);
    });
};

module.exports = mongoDB;