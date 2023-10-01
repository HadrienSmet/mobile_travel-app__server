require("dotenv").config();
const bcrypt = require("bcrypt");
const UsersModel = require("../../models/Users");
const jwt = require("jsonwebtoken");

//Handles what happens when the user submits the sign up form
//Starts by hashing the password --> 10 times
// --> Warning: bcrypt.hash is async function
//If hash succes: -create a new Object to post to the database with the password hashed
exports.signup = (req, res) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new UsersModel({
                // email: req.body.email,
                // password: hash,
                // firstname: req.body.firstname,
                // lastname: req.body.lastname,
                // age: req.body.age,
                // gender: req.body.gender,
                // country: req.body.country,
                // nationality: req.body.nationality,
                ...req.body,
                password: hash,
            });
            user.save()
                .then(() => {
                    res.status(200).json({
                        // userId: user._id,
                        ...user,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "24h" }
                        ),
                        // email: req.body.email,
                        // firstname: user.firstname,
                        // lastname: user.lastname,
                        // birth: user.birth,
                        // gender: user.gender,
                        // country: user.country,
                        // coordinates: user.coordinates,
                        // nationality: user.nationality,
                        // friends: user.friends,
                        // albums: user.albums,
                        // onTravel: user.onTravel,
                        // previousTrips: user.previousTrips,
                        // bio: user.bio,
                        // dreamTrips: user.dreamTrips,
                        // languages: user.languages,
                        // purpose: user.purpose,
                        // travelerType: user.travelerType,
                    });
                })
                .catch(() =>
                    res.status(400).json({
                        message: "There was an error during the saving",
                    })
                );
        })
        .catch(() => res.status(500).json({ message: "Server Error" }));
};
