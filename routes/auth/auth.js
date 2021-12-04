const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const client_url = "http://localhost:8080/";
const passport = require("passport");
const User = require("../../models/userModel");

//------------Register-------------
router.post("/auth/register", async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if ((!email, !password || !username)) {
            return res
                .status(401)
                .json({ message: "Please enter all the fields." });
        }

        //Checking if account with this email already exists

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: "An account with this emailID already exists.",
            });
        }

        // Hash the passwod using bcrypt
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
        });

        try {
            const savedUser = await newUser.save();
            console.log("savedUser:-", savedUser);
            res.status(200).json({
                savedUser: savedUser._id,
                message: " Your new account is created successfully.",
            });
        } catch (error) {
            console.error("DB_erroR:", error);
            res.status(400).send("Error");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

//----------------local-auth---------------
router.get("/auth/login", function (req, res, next) {
    res.json("Invalid credentials");
});

router.post(
    "/auth/login",
    passport.authenticate("local", {
        successRedirect: "/login/success",
        failureRedirect: "/login/failed",
    }),
    (req, res) => {
        console.log(req.user);
        res.json({ msg: "You are logged in successfully." });
    }
);

//-----------------GOOGLE-------------------
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "You logged in successfully",
            user: req.user,
        });
    }
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Login access failed",
    });
});

//-----------auth-google-------------------

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

//Google -callback"
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login/failed",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/logout", function (req, res, next) {
    req.logout();
    res.redirect(client_url);
});

module.exports = router;
