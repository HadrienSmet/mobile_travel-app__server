const TipsModel = require("../../models/Tips");

exports.likeOne = (req, res) => {
    const { tipsId, userId } = req.params;
    TipsModel.updateOne({ _id: tipsId }, { $push: { upVotes: userId } })
        .then(() => res.status(204).json({ message: "Like correctly send" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
