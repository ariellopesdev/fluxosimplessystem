const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const Company = require("../models/Company");

// Generate user token

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password, companyName, cnpj } = req.body;

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

  // Generate password hase
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
    company: company._id,
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
    token: generateToken(newUser._id),
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
    profileImage: user.profileImage,
    token: generateToken(user._id),
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
  const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select(
    "-password",
  );

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

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
