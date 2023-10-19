const UsersModel = require("../../models/Users");

exports.patchOne = (req, res) => {
    UsersModel.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                UsersModel.updateOne(
                    { _id: req.auth.userId },
                    { $set: { ...req.body } }
                )
                    .then(() => {
                        res.status(200).json({ message: "User updated" });
                    })
                    .catch(() =>
                        res.status(400).json({ message: "Error during update" })
                    );
            }
        })
        .catch(() => res.status(404).json({ message: "User not found" }));
};
