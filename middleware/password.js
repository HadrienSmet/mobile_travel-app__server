const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(2)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]);

module.exports = (req, res, next) => {
    console.log(
        "middleware/password.js l:24 You finally arrived to connect to the server!"
    );
    const userObject = req.body;
    const password = userObject.password;
    console.log("middleware/password.js l:27 password: " + userObject.password);
    if (passwordSchema.validate(password)) {
        console.log("middleware/password.js l:29 goign to next middleware");
        next();
    } else {
        return res.status(400).json({
            error: `The password is not strong enough ${passwordSchema.validate(
                password,
                { list: true }
            )}`,
        });
    }
};
