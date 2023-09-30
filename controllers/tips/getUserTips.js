const TipsModel = require("../../models/Tips");

exports.getUserTips = (req, res) => {
    const { userId } = req.params;
    TipsModel.find({ user_id: userId })
        .then((tips) => res.status(200).json(tips))
        .catch(() => res.status(404).json({ message: "Not found" }));
};
