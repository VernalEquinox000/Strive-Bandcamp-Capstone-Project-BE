const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const bcrypt = require("bcryptjs");
const { authenticate, refreshTokenUtil } = require("../middleware/authTools");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../middleware/cloudinary");
const q2m = require("query-to-mongo");

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
    const ifUser = await UserModel.findOne({ email: req.body.email });
    if (!ifUser) {
      const newUser = new UserModel(req.body);
      const { _id } = await newUser.save();
      res.status(201).send(newUser);
    } else {
      res.send("Email already in use!");
    }
    //add cookie
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
      secure: true,
      sameSite: "none",
    });
    res.status(201).cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body; //change
    const user = await UserModel.findByCredentials(email, password);
    console.log(user);
    if (user) {
      const tokens = await authenticate(user);
      //add cookie
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
        secure: true,
        sameSite: "none",

        /* THIS--->res.redirect (login / signup + ? access Token DA SALVERE NEL FE) */
      });

      await user.save();
      res
        .status(201)
        .cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send(tokens);
    } else {
      res.send("Email or password not included");
    }
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
/* const logoutAll = async (req, res, next) => {
  try {
    req.user.refreshToken = [];
    await req.author.save();
    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
}; */

//POST Refresh Token
const refreshToken = async (req, res, next) => {
  console.log(req.cookies);
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Refresh token missing");
    err.httpStatusCode = 400;
    next(err);
  } else {
    try {
      const { accessToken, refreshToken } = await refreshTokenUtil(
        oldRefreshToken
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
        secure: true,
        sameSite: "none",
      });
      res.send("tokens are refreshed!");
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

//GET users query
const getUsersQuery = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const totUsers = await UserModel.countDocuments(query.criteria);

    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send({ links: query.links("/users/links", totUsers), users });
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GET user logged profile
const meUser = async (req, res, next) => {
  try {
    let findMe = await UserModel.findOne({ _id: req.user._id });

    if (findMe.role === "artist") {
      const findMeArt = await UserModel.findOne({ _id: req.user._id }).populate(
        "albums"
      );
      res.send(findMeArt);
    } else if (findMe.role === "fan") {
      const findMeFan = await UserModel.findOne({ _id: req.user._id }).populate(
        "albumsCollected"
      );
      res.send(findMeFan);
    } else {
      res.send("profile not found");
    }
    res.send(findMe);
  } catch (error) {
    next(error);
  }
};

/* const meUser = async (req, res, next) => {
  try {
    const findMe = await UserModel.findOne({ id: req.user._id });
    if (findMe.role === "artist") {
      //const findMeArtist =
      await UserModel.findOne({ id: req.user._id }).populate([
        {
          path: "albums",
          select: [
            "_id",
            "title",
            "description",
            "cover",
            "releaseDate",
            "songs",
            "tags",
          ],
        },
      ]);
    } else {
      //const findMeFan =
      await UserModel.findOne({ id: req.user._id }).populate([
        {
          path: "albumsCollected",
          select: [
            "_id",
            "title",
            "description",
            "cover",
            "releaseDate",
            "songs",
            "albumPrice",
          ],
        },
        //add other path if needed,
        ,
      ]);
    }
    console.log(findMe);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
}; */

//PUT update logged user
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

//DELETE logged user
const deleteUser = (req, res, next) => {
  UserModel.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(`${req.user._id} deleted`);
    }
  });
};

//GET User By Id
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate([
      {
        path: "albums",
        select: [
          "_id",
          "title",
          "description",
          "cover",
          "releaseDate",
          "songs",
          "tags",
        ],
      },
      //add other path if needed,
      ,
    ]);

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
/* const googleAuth = async (req, res, next) => {
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
}; */

//POST Profile pic
const addProfilePic = async (req, res, next) => {
  try {
    const addPicture = await UserModel.findByIdAndUpdate(req.user._id, {
      $set: {
        profilePic: req.file.path,
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

//POST Background pic
/* const addBackgroundPic = async (req, res, next) => {
  try {
    const addPicture = await UserModel.findByIdAndUpdate(req.user._id, {
      $set: {
        backgroundPic: req.file.path,
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
}; */

//POST Header Pic
const addHeaderPic = async (req, res, next) => {
  try {
    const addPicture = await UserModel.findByIdAndUpdate(req.user._id, {
      $set: {
        headerPic: req.file.path,
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
  getUserById,
  /* googleAuth */
  addProfilePic,
  //addBackgroundPic,
  addHeaderPic,
  cloudMulter,
  getUsersQuery,
};
