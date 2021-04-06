const {
  signup,
  login,
  logout,
  allUsers,
  meUser,
  updateUser,
  deleteUser,
  refreshToken,
  googleAuth,
  cloudMulter,
  addProfilePic,
  addHeaderPic,
  addBackgroundPic,
  getUserById,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authMiddleware");
const passport = require("passport");

const routes = (app) => {
  app.route("/users/signup").post(signup);
  app.route("/users/login").post(login);
  app.route("/users/logout").post(authorize, logout);
  app.route("/users").get(allUsers);
  app
    .route("/users/me")
    .get(authorize, meUser)
    .put(authorize, updateUser)
    .delete(authorize, deleteUser);
  app
    .route("/users/me/profilePic")
    .post(authorize, cloudMulter.single("profilePic"), addProfilePic);
  app
    .route("/users/me/headerPic")
    .post(authorize, cloudMulter.single("headerPic"), addHeaderPic);
  app
    .route("/users/me/backgroundPic")
    .post(authorize, cloudMulter.single("backgroundPic"), addProfilePic);

  app.route("/users/refreshToken").post(refreshToken);
  app
    .route("/googleLogin")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
  app.route("/googleRedirect").get(passport.authenticate("google"), googleAuth);
  app.route("/users/:userId").get(getUserById);
};

module.exports = routes;
