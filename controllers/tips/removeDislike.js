const TipsModel = require("../../models/Tips");

exports.removeDislike = (req, res) => {
    const { tipsId, userId } = req.params;
    TipsModel.updateOne({ _id: tipsId }, { $pull: { downVotes: userId } })
        .then(() =>
            res.status(204).json({ message: "Dislike correctly removed" })
        )
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
