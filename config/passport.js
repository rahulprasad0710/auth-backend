const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

function intialize(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "username" }, function (
            username,
            password,
            done
        ) {
            console.log(username, password);
            User.findOne({ username: username }, async function (err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                try {
                    const passwordCheck = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (!passwordCheck) {
                        return done(null, false);
                    }
                } catch (error) {
                    console.log(error);
                }

                return done(null, user);
            });
        })
    );

    //------------Google Strategy--------------------------
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                console.log(profile);
                const newUser = {
                    userID: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    profileImg: profile.photos[0].value,
                };
                try {
                    let user = await User.findOne({
                        email: profile.emails[0].value,
                    });
                    if (user) {
                        cb(null, user);
                    } else {
                        user = await User.create(newUser);
                        cb(null, user);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        )
    );

    //--------------------------------------------------------------------
    passport.serializeUser((user, cb) => {
        cb(null, user);
    });

    passport.deserializeUser((user, done) => {
        User.findById(user.id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = intialize;
