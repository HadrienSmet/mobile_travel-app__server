const TipsModel = require("../../models/Tips");

exports.removeLike = (req, res) => {
    const { tipsId, userId } = req.params;
    TipsModel.updateOne({ _id: tipsId }, { $pull: { upVotes: userId } })
        .then(() => res.status(204).json({ message: "Like correctly removed" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
