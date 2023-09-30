const TipsModel = require("../../models/Tips");

exports.postOne = (req, res) => {
    const tips = new TipsModel(req.body);
    tips.save()
        .then(() => res.status(201).json({ message: "Ressource created" }))
        .catch(() => res.status(400).json({ message: "Bad request" }));
};
