const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Conectado a la base de datos");
    })
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = connectDb;