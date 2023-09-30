const UsersModel = require("../../models/Users");

exports.patchOne = (req, res) => {
    UsersModel.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                UsersModel.updateOne(
                    { _id: req.auth.userId },
                    {
                        // $set: {
                        //     onTravel: req.body.onTravel,
                        //     travelerType: req.body.travelerType,
                        //     bio: req.body.bio,
                        //     purpose: req.body.purpose,
                        //     languages: req.body.languages,
                        //     dreamTrips: req.body.dreamTrips,
                        // },
                        $set: { ...req.body },
                    }
                )
                    .then((user) => {
                        res.status(200).json({
                            ...user,
                            ...req.body,
                            // onTravel: req.body.onTravel,
                            // travelerType: req.body.travelerType,
                            // bio: req.body.bio,
                            // purpose: req.body.purpose,
                            // languages: req.body.languages,
                            // dreamTrips: req.body.dreamTrips,
                        });
                    })
                    .catch(() =>
                        res.status(400).json({ message: "Error during update" })
                    );
            }
        })
        .catch(() => res.status(404).json({ message: "User not found" }));
};
