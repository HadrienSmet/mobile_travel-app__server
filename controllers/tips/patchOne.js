const TipsModel = require("../../models/Tips");

exports.patchOne = (req, res) => {
    const { tipsId, userId } = req.params;
    TipsModel.findOne({ _id: tipsId })
        .then((tips) => {
            if (tips.user_id != userId) {
                return res.status(401).json({ message: "Unauthourized" });
            }
            TipsModel.updateOne({ _id: tipsId }, { ...req.body })
                .then(() => res.status(204).json({ message: "Tips updated" }))
                .catch(() => res.status(400).json({ message: "Bad request" }));
        })
        .catch(() => res.status.json({ message: "Not found" }));
};
