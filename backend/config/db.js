const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.4mqbrfi.mongodb.net/fluxosimples?retryWrites=true&w=majority`,
    );

    console.log("Conectou ao banco fluxosimples!");

    return dbConn;
  } catch (error) {
    console.log("Erro ao conectar ao banco:", error.message);
    process.exit(1);
  }
};

conn();

module.exports = conn;