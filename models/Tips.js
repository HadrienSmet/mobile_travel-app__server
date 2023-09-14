const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const positionSchema = mongoose.Schema({
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
});

const tipSchema = mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    madeDuring: { type: String, ref: "PreviousTrip", required: false },
    author: { type: String, required: true },
    location: { type: positionSchema, required: true },
    type: { type: String, required: true },
    about: { type: String, required: true },
    content: { type: String, required: false },
    upVotes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    downVotes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
});

module.exports = mongoose.model("Tips", tipSchema);
