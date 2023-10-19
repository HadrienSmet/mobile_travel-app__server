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
                ...req.body,
                password: hash,
            });
            user.save()
                .then(() => {
                    let resData = { ...user._doc };
                    delete resData.password;
                    res.status(200).json({
                        ...resData,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "24h" }
                        ),
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
