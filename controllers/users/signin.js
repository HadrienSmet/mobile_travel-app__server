require("dotenv").config();
const UsersModel = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signin = (req, res) => {
    UsersModel.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(500).json({
                    message: "Server error",
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
                    let resData = { ...user._doc };
                    delete resData.password;
                    console.log(resData);
                    res.status(200).json({
                        ...resData,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch(() => res.status(500).json({ message: "Error server" }));
        })
        .catch(() => res.status(404).json({ message: "User not found" }));
};
