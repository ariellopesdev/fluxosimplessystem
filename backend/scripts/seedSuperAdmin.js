require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Company = require("../models/Company");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.4mqbrfi.mongodb.net/fluxosimples?retryWrites=true&w=majority`,
    );

    console.log("Conectado ao banco fluxosimples.");

    let company = await Company.findOne({
      name: "ArielLopesDev",
    });

    if (!company) {
      company = await Company.create({
        name: "ArielLopesDev",
        cnpj: "00000000000000",
      });

      console.log("Empresa padrão criada.");
    }

    const adminExists = await User.findOne({
      email: "admin@ariellopesdev.com",
    });

    if (adminExists) {
      console.log("Super admin já existe.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("Admin@123", salt);

    await User.create({
      name: "Ariel Lopes",
      email: "admin@ariellopesdev.com",
      password: passwordHash,
      role: "SUPER_ADMIN",
      company: company._id,
    });

    console.log("=================================");
    console.log("Super admin criado com sucesso!");
    console.log("Empresa: ArielLopesDev");
    console.log("Email: admin@ariellopesdev.com");
    console.log("Senha: Admin@123");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao criar super admin:", error);
    process.exit(1);
  }
};

seedSuperAdmin();