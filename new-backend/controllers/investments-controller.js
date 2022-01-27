const fs = require("fs");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Investment = require("../models/investment");
const User = require("../models/user");

const getInvestments = async (req, res, next) => {
  let investments;

  try {
    investments = await Investment.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching investments failed, try again later.",
      500
    );

    return next(error);
  }
  res.json({
    investments: investments.map((investment) =>
      investment.toObject({ getters: true })
    ),
  });
};

const getInvestmentById = async (req, res, next) => {
  const investmentId = req.params.cid;

  console.log(investmentId);

  let investment;
  try {
    console.log("TRYIN");
    investment = await Investment.findById(investmentId);
  } catch (err) {
    const error = new HttpError("Could not find a investment", 500);

    return next(error);
  }

  if (!investment) {
    const error = new HttpError("Could not find investment", 404);
    return next(error);
  }

  res.json({ investment: investment.toObject({ getters: true }) });
};

const getInvestmentsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);

  let userWithInvestments;

  try {
    userWithInvestments = await User.findById(userId).populate("investments");
    console.log(userWithInvestments);
  } catch (err) {
    const error = new HttpError("Fetching failed, please try again", 500);
    console.log(err);
    return next(error);
  }

  if (!userWithInvestments || userWithInvestments.investments.length === 0) {
    return next(
      new HttpError("Could not find investments for this user id", 404)
    );
  }

  res.json({
    investments: userWithInvestments.investments.map((investment) =>
      investment.toObject({ getters: true })
    ),
  });
};

const createInvestment = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, check data.", 422));
  }

  const { name, short_name_handle, date, price, amount, value } = req.body;

  const createdInvestment = new Investment({
    name,
    short_name_handle,
    date,
    price,
    amount,
    value,
    user_id: req.userData.userId,
  });

  console.log(createdInvestment);

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating investment failed, try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for this id", 404);
    next(error);
  }

  // console.log("user: " + user);

  try {
    Investment.createCollection();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdInvestment.save({ session: sess });
    console.log("idkkkk");
    user.investments.push(createdInvestment);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating investment failed in session, try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ investment: createdInvestment });
};

const updateInvestment = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs, check your data", 422));
  }

  const { name, short_name_handle, date, price, amount, value } = req.body;

  const investmentId = req.params.iid;

  let investment;
  try {
    investment = await Investment.findById(investmentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update investment",
      500
    );

    return next(error);
  }

  if (investment.user_id.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this investment.",
      401
    );
    return next(error);
  }

  investment.name = name;
  investment.short_name_handle = short_name_handle;
  investment.date = date;
  investment.price = price;
  investment.amount = amount;
  investment.value = value;

  try {
    await investment.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update investment",
      500
    );

    return next(error);
  }
  res.status(200).json({ investment: investment.toObject({ getters: true }) });
};

const deleteInvestment = async (req, res, next) => {
  const investmentId = req.params.cid;
  console.log(investmentId);

  let investment;
  try {
investment = await Investment.findById(investmentId).populate("user_id");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete investment.",
      500
    );
    return next(error);
  }

  if (!investment) {
    const error = new HttpError("Could not find investment for this id.", 404);
    return next(error);
  }

  if (investment.user_id.id !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete this.", 401);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await investment.remove({ session: sess });
    investment.user_id.investments.pull(investment);
    await investment.user_id.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete investment",
      500
    );
    return next(error);
  }


  res.status(200).json({ message: "Investment deleted." });
};

exports.getInvestments = getInvestments;
exports.getInvestmentById = getInvestmentById;
exports.getInvestmentsByUserId = getInvestmentsByUserId;
exports.createInvestment = createInvestment;
exports.updateInvestment = updateInvestment;
exports.deleteInvestment = deleteInvestment;