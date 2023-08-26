const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const positionSchema = mongoose.Schema({
    longitude: { type: Number, required: false },
    latitude: { type: Number, required: false },
});
const dateSchema = mongoose.Schema({
    day: { type: String, required: false },
    month: { type: String, required: false },
    year: { type: String, required: false },
});
const pictureSchema = mongoose.Schema({
    url: { type: String, required: false },
    // location: [positionSchema],
    location: { type: positionSchema, required: false },
});
const albumSchema = mongoose.Schema({
    name: { type: String, required: false },
    pictures: [pictureSchema],
});

const tripTipSchema = mongoose.Schema({
    location: { type: positionSchema, required: false },
    type: { type: String, required: false },
    about: { type: String, required: false },
    content: { type: String, required: false },
});
const tripStepsSchema = mongoose.Schema({
    location: { type: positionSchema, required: false },
    event: { type: String, required: false },
    date: { type: dateSchema, required: false },
    content: { type: String, required: false },
});
const previousTripSchema = mongoose.Schema({
    title: { type: String, required: false },
    type: { type: String, required: false },
    withWhom: { type: String, required: false },
    tips: [tripTipSchema],
    steps: [tripStepsSchema],
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
