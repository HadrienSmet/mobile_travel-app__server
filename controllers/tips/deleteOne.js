const TipsModel = require("../../models/Tips");

exports.deleteOne = (req, res) => {
    const { userId, tipsId } = req.params;
    TipsModel.findOne({ _id: tipsId })
        .then((tips) => {
            if (tips.user_id != userId) {
                return res.status(401).json({ message: "Unauthourized" });
            }
            TipsModel.deleteOne({ _id: tipsId })
                .then(() => {
                    res.status(204).json({
                        message: "Tips succesfully delete",
                    });
                })
                .catch(() => {
                    res.status(500).json({
                        message:
                            "An error occured while the tips was getting removed",
                    });
                });
        })
        .catch(() => res.status(404).json({ message: "Tips not found" }));
};
