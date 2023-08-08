const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const albumSchema = mongoose.Schema({
    name: { type: String, required: false },
    pictures: { type: [String], required: false },
});

const previousTripSchema = mongoose.Schema({
    destination: { type: String, required: false },
    year: { type: Number, required: false },
    duration: { type: String, required: false },
    withWho: { type: String, required: false },
    details: { type: String, required: false },
});

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: false },
    coverPicture: { type: String, required: false },
    description: { type: String, required: false },
    dreamTrips: { type: [String], default: undefined, required: false },
    previousTrips: [previousTripSchema],
    albums: [albumSchema],
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    country: { type: String, required: true },
    nationality: { type: String, required: true },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
