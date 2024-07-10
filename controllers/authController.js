const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to register user", details: err.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.SECRET,
      {
        expiresIn: "3d",
      }
    );
    const { password, ...info } = user._doc;
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(info);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to login user", details: err.message });
  }
};

// Logout a user
const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("token", { httpOnly: true, sameSite: "none", secure: true })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to log out user", details: err.message });
  }
};

// Refetch user data
const refetchUser = (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, {}, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ error: "Invalid token", details: err.message });
    }
    res.status(200).json(data);
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refetchUser,
};
