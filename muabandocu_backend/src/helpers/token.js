require("dotenv").config();
const jwt = require("jsonwebtoken");

function signToken(accountId) {
  return new Promise((resolve, reject) => {
    const payload = {
      id: accountId,
    };
    const secret = process.env.PRIVATE_KEY;
    const options = {
      expiresIn: process.env.EXPISE_IN,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, scretKey, (err, payload) => {
      if (err) {
        err.statusCode = 401;
        reject(err);
      }
      resolve(payload);
    });
  });
}

module.exports = {
  signToken,
  verifyToken,
};
