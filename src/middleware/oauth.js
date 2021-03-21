const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const { authenticate } = require("./authTools");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      }); */
      console.log(profile);
    }
  )
);
