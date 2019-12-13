const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../../config/keys");
const validateRegisterInput = require("../validation/register");

const register = async data => {
  try {
    const { message, isValid } = validateRegisterInput(data);

    if (!isValid) {
      throw new Error(message);
    }
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(
      {
        name,
        email,
        password: hashedPassword
      },
      err => {
        if (err) throw err;
      }
    );

    user.save();
    const token = jwt.sign({ id: user._id }, keys.secretOrKey);

    return { token, loggedIn: true, ...user._doc, password: null };
  } catch (err) {
    throw err;
  }
};

const login = async data => {
  try {
    // use our other validator we wrote to validate this data
    const { message, isValid } = validateLoginInput(data);

    if (!isValid) {
      throw new Error(message);
    }

    const { email, password } = data;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("Incorrect email/password");
    }

    const isPassword = await bcrypt.compare(password, existingUser.password);
    if (!isPassword) {
      throw new Error("Incorrect email/password");
    } else {
      const token = jwt.sign({ id: existingUser._id }, keys.secretOrKey);
      return { token, loggedIn: true, ...existingUser._doc, password: null };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { register, login };
const logout = async data => {

  const { _id } = data;
  const user = User.findById({ _id });
  const token = "";

  return { token, loggedIn: false, ...user._doc };
};

module.exports = { register, logout };
