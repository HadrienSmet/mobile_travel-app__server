const TipsModel = require("../../models/Tips");

exports.dislikeOne = (req, res) => {
    const { tipsId, userId } = req.params;
    TipsModel.updateOne({ _id: tipsId }, { $push: { downVotes: userId } })
        .then(() => res.status(204).json({ message: "Dislike correctly send" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
