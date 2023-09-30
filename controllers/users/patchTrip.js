const UsersModel = require("../../models/Users");

exports.patchTrip = (req, res) => {
    const { title, type, withWhom, steps } = req.body;
    UsersModel.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                UsersModel.updateOne(
                    {
                        _id: req.auth.userId,
                        "previousTrips.title": title,
                    },
                    {
                        $set: {
                            "previousTrips.$.title": title,
                            "previousTrips.$.type": type,
                            "previousTrips.$.withWhom": withWhom,
                            "previousTrips.$.steps": steps,
                        },
                    },
                    { new: true }
                )
                    .then((updatedUser) => {
                        if (!updatedUser) {
                            return res.status(500).json({
                                message:
                                    "Updated but did not succeeded to properly send the updated user",
                            });
                        }
                        res.status(200).json(updatedUser);
                    })
                    .catch(() =>
                        res.status(400).json({ message: "Error during update" })
                    );
            }
        })
        .catch(() => res.status(404).json({ message: "User not found" }));
};
