const UsersModel = require("../../models/Users");

exports.deleteTrip = (req, res) => {
    const tripTitle = req.params.tripTitle;
    UsersModel.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                return res.status(401).json({ message: "Unauthourized" });
            }
            UsersModel.updateOne(
                { _id: req.auth.userId },
                { $pull: { previousTrips: { title: tripTitle } } }
            )
                .then(() => {
                    res.status(200).json({
                        message: "Trip succesfully delete",
                    });
                })
                .catch(() => {
                    res.status(500).json({
                        message:
                            "An error occured while the trip was getting removed",
                    });
                });
        })
        .catch(() => res.status(404).json({ message: "User not found" }));
};
