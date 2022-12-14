const jwt = require('jsonwebtoken');
const config = require('../config/config');

const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile: user.mobile,
      user_oauth_provider: user.user_oauth_provider,
      user_oauth_id: user.user_oauth_id,
      user_role: user.user_role,
      status: user.status,
    },
    config.secret
  );
};
const generateOTP = (otp_length) => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, config.secret, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        req.userId = decode._id;
        req.userRole = decode.user_role;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (user.user_role === 'admin') {
      req.user = user;
      req.userId = user._id;
      req.userRole = 'admin';
      next();
      return;
    } 
  });
};

const isPlayer = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.user_role === 'user') {
      req.user = user;
      req.userId = user._id;
      req.role = 'user';
      next();
      return;
    }
  });
};

module.exports = { generateToken, generateOTP, isAuth, isAdmin, isPlayer };
