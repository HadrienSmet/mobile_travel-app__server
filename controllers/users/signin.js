require("dotenv").config();
const UsersModel = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Handles what happens when the user submits the sign in form
//Starts by searching an email in the data matching whit one provided by the user
//Error if the mailadress can't be found
//If not we compare the password provided by the user with the one in the database
//Warning --> bcrypt.compare is async function
//If passwords match: provides an authorisation token to the user
exports.signin = (req, res) => {
    UsersModel.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: "User not found",
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            message: "Incorrect email or password",
                        });
                    }
                    res.status(200).json({
                        email: user.email,
                        profilePicture: user.profilePicture,
                        country: user.country,
                        coordinates: user.coordinates,
                        nationality: user.nationality,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        birth: user.birth,
                        gender: user.gender,
                        bio: user.bio,
                        onTravel: user.onTravel,
                        languages: user.languages,
                        purpose: user.purpose,
                        travelerType: user.travelerType,
                        dreamTrips: user.dreamTrips,
                        previousTrips: user.previousTrips,
                        albums: user.albums,
                        friends: user.friends,
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch(() => res.status(500).json({ message: "Error server" }));
        })
        .catch(() => res.status(500).json({ message: "User not found" }));
};
