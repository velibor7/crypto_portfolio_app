const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("Auth failed in check-auth middleware");
      throw new Error("Auth failed in check-auth middleware");
    }
    // console.log("token: " + token);
    const decodedToken = jwt.verify(token, "secret");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Auth Failed!", 403);
    console.log(err);
    return next(error);
  }
};