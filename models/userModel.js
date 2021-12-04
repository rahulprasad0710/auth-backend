const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userID: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
        },
        displayName: {
            type: String,
        },
        profileImg: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
