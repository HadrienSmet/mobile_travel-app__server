require("dotenv").config();
const TipsModel = require("../models/Tips");

exports.getUserTips = (req, res) => {
    const userId = req.params.userId;
    TipsModel.find({ user_id: userId })
        .then((tips) => res.status(200).json(tips))
        .catch(() => res.status(404).json({ message: "Not found" }));
};
exports.getPreviousTripTips = (req, res) => {
    const userId = req.params.userId;
    const tripTitle = req.params.tripTitle;
    TipsModel.find({
        user_id: userId,
        madeDuring: tripTitle,
    })
        .then((tips) => res.status(200).json(tips))
        .catch(() => res.status(404).json({ message: "Not found" }));
};

exports.postTips = (req, res) => {
    console.log({ ...req.body });
    // const tips = new TipsModel({
    //     user_id: req.body.user_id,
    //     author: req.body.author,
    //     location: req.body.location,
    //     type: req.body.type,
    //     about: req.body.about,
    //     content: req.body.content,
    //     upVotes: req.body.upVotes,
    //     downVotes: req.body.downVotes,
    // });
    const tips = new TipsModel(req.body);
    tips.save()
        .then(() => res.status(201).json({ message: "Ressource created" }))
        .catch(() => res.status(400).json({ message: "Bad request" }));
};

exports.patchTips = (req, res) => {
    const tipsId = req.params.tipsId;
    const userId = req.params.userId;
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

exports.deleteTips = (req, res) => {
    const userId = req.params.userId;
    const tipsId = req.params.tipsId;
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
exports.likeTips = (req, res) => {
    const tipsId = req.params.tipsId;
    const userId = req.params.userId;
    TipsModel.updateOne({ _id: tipsId }, { $push: { upVotes: userId } })
        .then(() => res.status(204).json({ message: "Like correctly send" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
exports.dislikeTips = (req, res) => {
    const tipsId = req.params.tipsId;
    const userId = req.params.userId;
    TipsModel.updateOne({ _id: tipsId }, { $push: { downVotes: userId } })
        .then(() => res.status(204).json({ message: "Dislike correctly send" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
exports.removeLike = (req, res) => {
    const tipsId = req.params.tipsId;
    const userId = req.params.userId;
    TipsModel.updateOne({ _id: tipsId }, { $pull: { upVotes: userId } })
        .then(() => res.status(204).json({ message: "Like correctly removed" }))
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
exports.removeDislike = (req, res) => {
    const tipsId = req.params.tipsId;
    const userId = req.params.userId;
    TipsModel.updateOne({ _id: tipsId }, { $pull: { downVotes: userId } })
        .then(() =>
            res.status(204).json({ message: "Dislike correctly removed" })
        )
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
