const UsersModel = require("../../models/Users");

exports.putTrip = (req, res) => {
    UsersModel.findOne({ _id: req.params.userId })
        .then((user) => {
            if (user._id != req.auth.userId) {
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                let trip = { ...req.body };
                UsersModel.updateOne(
                    { _id: req.auth.userId },
                    { $push: { previousTrips: trip } }
                )
                    .then(() =>
                        res.status(201).json({
                            message: "Trip saved",
                            newTrip: trip,
                        })
                    )
                    .catch(() =>
                        res.status(400).json({
                            message: "Error during update",
                        })
                    );
            }
        })
        .catch(() =>
            res.status(400).json({
                message: "User not found",
            })
        );
};
