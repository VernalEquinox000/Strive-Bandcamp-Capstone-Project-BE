const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const bcrypt = require("bcryptjs");
const { authenticate, refreshTokenUtil } = require("../middleware/authTools");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../middleware/cloudinary");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

//POST Signup
const signup = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    //add cookie
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    });
    res.status(201).cookie("accessToken", token.token, {
      httpOnly: true,
    });

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    console.log(user);
    //insert if?
    const tokens = await authenticate(user);
    //add cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    });

    await user.save();
    res
      .status(201)
      .cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
      })
      .send(tokens);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Logout
const logout = async (req, res, next) => {
  try {
    newRefreshTokens = req.user.refreshTokens.filter(
      (token) => token.token !== req.body.refreshToken
    );
    await req.user.updateOne({ refreshTokens: newRefreshTokens });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("logged out");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Logout All
const logoutAll = async (req, res, next) => {
  try {
    req.user.refreshToken = [];
    await req.author.save();
    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Refresh Token
const refreshToken = async (req, res, next) => {
  console.log(req.cookies);
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Refresh token missing");
    err.httpStatusCode = 400;
    next(err);
  } else {
    try {
      const newTokens = await refreshTokenUtil(oldRefreshToken);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      });
      res.send(newTokens);
    } catch (error) {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 403;
      next(err);
    }
  }
};

//GET all users
const allUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    if (users.length !== 0) {
      res.status(200).send(users);
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//GET user profile
const meUser = async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
};

//PUT user
const updateUser = (req, res, next) => {
  UserModel.findOneAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    }
  );
};

//DELETE User
const deleteUser = (req, res, next) => {
  UserModel.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(`${req.user._id} deleted`);
    }
  });
};

//GET single user
const getSingleUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    /*       need to add.populate([
      {
        path: "following",
        select: ["_id", "username", "picture"],
      },
      {
        path: "followers",
        select: ["_id", "username", "picture"],
      },
    ]); */
    res.send(user);
  } catch (error) {
    error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

//GET User By Id
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    /* .populate([
      {
        path: "following",
        select: ["_id", "username", "picture"],
      },
      {
        path: "followers",
        select: ["_id", "username", "picture"],
      },
    ]); */
    if (user) {
      res.status(200).send(user);
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

//GET Google Auth
const googleAuth = async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.token, {
      httpOnly: true,
    });
    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    });

    res.status(200).redirect(process.env.FE_URL + "/home");
  } catch (error) {
    next(error);
  }
};

const addProfilePic = async (req, res, next) => {
  try {
    const addPicture = await UserModel.findByIdAndUpdate(req.user_id, {
      $set: {
        picture: req.file.path,
      },
    });
    if (addPicture) {
      res.status(200).send(addPicture);
    } else {
      res.send("User not found!");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  allUsers,
  meUser,
  updateUser,
  deleteUser,
  refreshToken,
  getSingleUser,
  getUserById,
  googleAuth,
  addProfilePic,
  cloudMulter,
};
