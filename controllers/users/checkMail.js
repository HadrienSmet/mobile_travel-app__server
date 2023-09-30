const UsersModel = require("../../models/Users");

exports.checkMail = (req, res) => {
    UsersModel.findOne({ email: req.params.email })
        .then((user) => res.status(200).json(user))
        .catch(() =>
            res.status(400).json({
                message:
                    "Cette adresse email n'est pas encore présente dans la base donnée",
            })
        );
};
