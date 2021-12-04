const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");
mongoose.Promise = global.Promise;
const app = express();
dotenv.config();

//passport config
const initialPassport = require("./config/passport");
initialPassport(passport);
app.use(
    session({
        secret: "rahulapp123",
        resave: true,
        saveUninitialized: true,
        maxAge: 1000 * 24 * 60 * 60,
    })
);

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:8080/",
        methods: ["GET", "PUT", "POST"],
    })
);
// app.use(cors());
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ limit: "60mb", extended: true }));
app.use(morgan("dev"));

// ---------Passport Middleware-----------------------
app.use(passport.initialize());
app.use(passport.session());

//routes
const authRoute = require("./routes/auth/auth");

app.use("/", authRoute);
const mongoDB = process.env.MDB_LOCAL;
mongoose.connect(
    mongoDB,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    (err) => {
        if (!err) {
            console.log("MongoDB Connection Succeeded.");
        } else {
            console.log("Error in DB connection:- " + err);
        }
    }
);

app.get("/", (req, res) => {
    res.send("Home Page");
});
const port = 5000;
app.listen(port, () => {
    console.log(`Server running at port :- ${port}`);
});
