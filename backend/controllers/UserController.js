const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const Company = require("../models/Company");

// Generate user token

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    },
  );
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password, companyName, cnpj, role } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res
      .status(422)
      .json({ errors: ["Já existe um usuário cadastrado com este e-mail."] });
    return;
  }

  // Verify if company exists
  let company = await Company.findOne({ cnpj });
  if (!company) {
    company = await Company.create({
      name: companyName,
      cnpj,
    });
  }

  // Prevent unauthorized SUPER_ADMIN creation
  if (role === "SUPER_ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      errors: ["You do not have permission to create SUPER_ADMIN users."],
    });
  }

  // Generate password hase
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
    company: company._id,
    role: role || "USER",
  });

  // If user was created successfully, return the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser),
  });
};

// Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //Check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
    return;
  }

  // Return user with token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    token: generateToken(user),
  });
};

// Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("company")
    .select("-password");

  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  const { name, password, company } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  //I had to digit new before mongoose.Types to fix the bug about internal error 500.
  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id),
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    //Generate password hase
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (company) {
    user.company = company;
  }

  await user.save();

  const updatedUser = await User.findById(user._id)
    .populate("company")
    .select("-password");

  res.status(200).json(updatedUser);
};

// Get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      "-password",
    );

    //Check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "Se este e-mail estiver cadastrado, enviaremos um link de recuperação.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Fluxo Simples System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Redefinição de senha",
      html: `
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este link expira em 30 minutos.</p>
      `,
    });

    res.status(200).json({
      message:
        "Se este e-mail estiver cadastrado, enviaremos um link de recuperação.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao enviar e-mail de recuperação."],
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        errors: ["Token inválido ou expirado."],
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao redefinir senha."],
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  forgotPassword,
  resetPassword,
};
