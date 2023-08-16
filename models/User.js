const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const positionSchema = mongoose.Schema({
    long: { type: String, required: false },
    lat: { type: String, required: false },
});
const durationSchema = mongoose.Schema({
    arrival: { type: String, required: false },
    departure: { type: String, required: false },
});
const pictureSchema = mongoose.Schema({
    url: { type: String, required: false },
    location: [positionSchema],
});
const albumSchema = mongoose.Schema({
    name: { type: String, required: false },
    pictures: [pictureSchema],
});

const tripTipsSchema = mongoose.Schema({
    location: [positionSchema],
    about: { type: String, required: false },
    tips: { type: String, required: false },
    picture: { type: String, required: false },
});
const previousTripSchema = mongoose.Schema({
    countries: { type: [String], required: false },
    duration: { type: durationSchema, required: false },
    kind: { type: String, required: false },
    withWho: { type: String, required: false },
    tripTips: [tripTipsSchema],
    resume: { type: String, required: false },
});

const userSchema = mongoose.Schema({
    age: { type: String, required: true },
    albums: [albumSchema],
    bio: { type: String, required: false },
    country: { type: String, required: true },
    dreamTrips: { type: [String], default: undefined, required: false },
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    friends: { type: [String], default: [] },
    gender: { type: String, required: true },
    languages: { type: [String], default: undefined, required: false },
    lastname: { type: String, required: true },
    nationality: { type: String, required: true },
    onTravel: { type: Boolean, required: false, default: false },
    password: { type: String, required: true },
    previousTrips: [previousTripSchema],
    profilePicture: { type: String, required: false },
    purpose: { type: String, required: false },
    travelerType: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
