require("dotenv").config();
const jwt = require("jsonwebtoken");

const { PRIVATE_KEY } = process.env;

const auth = async (req, res, next) => {
  const token = await req.headers["authorization"];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Sign in again",
    });
  }

  try {
    await jwt.verify(token.split(" ")[1], PRIVATE_KEY, function (err, decoded) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "sign in failed",
        });
      }

      if (decoded) {
        req.emailId = decoded.email;
        // console.log(decoded.email);
        return next();
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = auth;
