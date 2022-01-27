const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const { create } = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Could not fetch users, try again later", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, check your data", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists! Please login!", 422);
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create a user, please try again.",
      500
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    cocktails: [],
  });

  try {
    await createdUser.save();
    console.log("user created");
  } catch (err) {
    const error = new HttpError("Signing up failed, try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "secret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, try again later", 500);

    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
      },
      "secret",
      { expiresIn: "1h" }
    );

    console.log("logged in");
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );

    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;