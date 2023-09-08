require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { Storage } = require("@google-cloud/storage");
// const path = require("path");
const UserModel = require("../models/User");
// const googleCloud = new Storage({
//     keyFilename: path.join(
//         __dirname,
//         `../${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
//     ),
//     projectId: process.env.GCS_ID,
// });

// const gcFiles = googleCloud.bucket(process.env.GCS_SPLIT_STRING);

// const handleCoverPicture = (req, res) => {
//     let urlCoverPicture;
//     for (let i = 0; i < req.files.length; i++) {
//         if (req.files[i].filename !== undefined)
//             urlCoverPicture = `${process.env.GCS_URL}${req.files[i].filename}`;
//     }
//     UserModel.updateOne(
//         { _id: req.params.id },
//         { $set: { coverPicture: urlCoverPicture } }
//     )
//         .then(() =>
//             res.status(201).json({
//                 message: "Photo de couverture mise à jour!",
//                 coverPicture: urlCoverPicture,
//             })
//         )
//         .catch(() =>
//             res.status(400).json({
//                 message: "Mauvaise requete l'update a mal tourné",
//             })
//         );
// };

// const handleDelete = ()

//Handles what happens when the user submits the sign up form
//Starts by hashing the password --> 10 times
// --> Warning: bcrypt.hash is async function
//If hash succes: -create a new Object to post to the database with the password hashed
exports.signup = (req, res, next) => {
    console.log("controllers/user.js l:45 - you arrived in the controller!");
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new UserModel({
                email: req.body.email,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                gender: req.body.gender,
                country: req.body.country,
                nationality: req.body.nationality,
            });
            console.log("controllers/user.js l:63 - user: " + user);
            user.save()
                .then(() => {
                    console.log("controllers/user.js l:66 - user is saved");
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "24h" }
                        ),
                        email: req.body.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        age: user.age,
                        gender: user.gender,
                        country: user.country,
                        nationality: user.nationality,
                        friends: user.friends,
                        albums: user.albums,
                        onTravel: user.onTravel,
                        previousTrips: user.previousTrips,
                        bio: user.bio,
                        dreamTrips: user.dreamTrips,
                        languages: user.languages,
                        purpose: user.purpose,
                        travelerType: user.travelerType,
                    });
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//Handles what happens when the user submits the sign in form
//Starts by searching an email in the data matching whit one provided by the user
//Error if the mailadress can't be found
//If not we compare the password provided by the user with the one in the database
//Warning --> bcrypt.compare is async function
//If passwords match: provides an authorisation token to the user
exports.login = (req, res, next) => {
    UserModel.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message:
                        "Cet email n'est pas présent dans notre base de donnée",
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            message: "Paire login/mot de passe incorrecte",
                        });
                    }
                    res.status(200).json({
                        email: user.email,
                        profilePicture: user.profilePicture,
                        country: user.country,
                        nationality: user.nationality,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        age: user.age,
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
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.patchProfileData = (req, res, next) => {
    console.log("controllers/user.js l:78 - you arrived in the controller!");
    UserModel.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                console.log("unauthorized");
                res.status(401).json({ error });
            } else {
                console.log("Going to be updated");
                UserModel.updateOne(
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
                        console.log("update worked fine going to send the res");
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
                    .catch((error) => {
                        console.log(
                            "Something went wrong during the update or during response"
                        );
                        res.status(400).json({ error });
                    });
            }
        })
        .catch((error) => {
            console.log("Something went wrong during the search for the user");
            res.status(404).json({ error });
        });
};
exports.deletePreviousTrip = (req, res) => {
    const tripTitle = req.params.tripTitle;
    console.log("you are in the controller");
    UserModel.findOne({ _id: req.params.id })
        .then((user) => {
            console.log("found it");
            if (user._id != req.auth.userId) {
                res.status(401).json({ message: "Unauthourized" });
            } else {
                UserModel.findOne({
                    _id: req.auth.userId,
                    "previousTrips.title": tripTitle,
                });
            }
        })
        .catch((error) => res.status(404).json({ error }));
};
exports.patchPreviousTrips = (req, res, next) => {
    console.log("controllers/user.js l:78 - you arrived in the controller!");
    UserModel.findOne({ _id: req.params.id })
        .then((user) => {
            console.log("He found it but something went wrong in this block");
            if (user._id != req.auth.userId) {
                console.log("unauthorized");
                res.status(401).json({ error });
            } else {
                console.log("Going to be updated");
                UserModel.updateOne(
                    {
                        _id: req.auth.userId,
                        "previousTrips.title": req.body.title,
                    },
                    {
                        $set: {
                            "previousTrips.$.title": req.body.title,
                            "previousTrips.$.type": req.body.type,
                            "previousTrips.$.withWhom": req.body.withWhom,
                            "previousTrips.$.tips": req.body.tips,
                            "previousTrips.$.steps": req.body.steps,
                        },
                    }
                )
                    .then(() => {
                        res.status(200).json({ message: "turned out great" });
                    })
                    .catch((error) => {
                        console.log(
                            "Something went wrong during the update or during response"
                        );
                        res.status(400).json({ error });
                    });
            }
        })
        .catch((error) => {
            console.log("Something went wrong during the search for the user");
            res.status(404).json({ error });
        });
};

exports.addNewTrip = (req, res, next) => {
    UserModel.findOne({ _id: req.params.userId })
        .then((user) => {
            if (user._id != req.auth.userId) {
                return res
                    .status(401)
                    .json({ message: "Requête non-autorisée" });
            } else {
                let trip = { ...req.body };
                UserModel.updateOne(
                    { _id: req.auth.userId },
                    { $push: { previousTrips: trip } }
                )
                    .then(() =>
                        res.status(201).json({
                            message:
                                "Voyage sauvegardé dans la base de donnée!",
                            newTrip: trip,
                        })
                    )
                    .catch(() =>
                        res.status(400).json({
                            message:
                                "Quelque chose a planté durant la modification..",
                        })
                    );
            }
        })
        .catch(() =>
            res.status(400).json({
                message: "On ne trouve pas d'utilisateur possédant cet id",
            })
        );
};

exports.checkMail = (req, res, next) => {
    UserModel.findOne({ email: req.params.email })
        .then((user) => res.status(200).json(user))
        .catch(() =>
            res.status(400).json({
                message:
                    "Cette adresse email n'est pas encore présente dans la base donnée",
            })
        );
};
//This function handles the uploading of the profile picture inside the data base and inside the API
//It starts by taking the file in the request in order to put it into a variable with the appropriate name
//Then we start searching in the data base for a user whose id matches with the one from the request url
//If the user is found we take care to be sure about the authentification by comparing the user's id and the one from the auth middleware
//If everything is ok we can set the new key a the root of the user object
// exports.uploadUserPictures = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then((user) => {
//             if (user._id != req.auth.userId) {
//                 res.status(403).json({ error });
//             } else {
//                 let urlProfilePicture = undefined;
//                 let urlsAlbumPictures = [];
//                 for (let i = 0; i < req.files.length; i++) {
//                     if (req.files[i].filename !== undefined) {
//                         if (urlProfilePicture === undefined) {
//                             urlProfilePicture = `${process.env.GCS_URL}${req.files[i].filename}`;
//                         } else {
//                             let current = `${process.env.GCS_URL}${req.files[i].filename}`;
//                             urlsAlbumPictures.push(current);
//                         }
//                     }
//                 }
//                 UserModel.updateOne(
//                     { _id: req.auth.userId },
//                     {
//                         $set: {
//                             profilePicture: urlProfilePicture,
//                             albums: [
//                                 {
//                                     name: req.body.albumName,
//                                     pictures: urlsAlbumPictures,
//                                 },
//                             ],
//                         },
//                     }
//                 )
//                     .then(() => {
//                         res.status(200).json({
//                             email: user.email,
//                             profilePicture: urlProfilePicture,
//                             pseudo: user.pseudo,
//                             country: user.userData.country,
//                             firstName: user.userData.firstName,
//                             lastName: user.userData.lastName,
//                             age: user.userData.age,
//                             gender: user.userData.gender,
//                             description: user.description,
//                             dreamTrips: user.dreamTrips,
//                             previousTrips: user.previousTrips,
//                             following: user.following,
//                             followers: user.followers,
//                             albums: [
//                                 {
//                                     name: req.body.albumName,
//                                     pictures: urlsAlbumPictures,
//                                 },
//                             ],
//                         });
//                     })
//                     .catch((error) => res.status(401).json({ error }));
//             }
//         })
//         .catch((error) => res.status(402).json({ error }));
// };

// exports.uploadAlbum = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.userId })
//         .then((user) => {
//             if (user._id != req.auth.userId) {
//                 return res
//                     .status(401)
//                     .json({ message: "Requête non-autorisée" });
//             } else {
//                 let urlsAlbumPictures = [];
//                 for (let i = 0; i < req.files.length; i++) {
//                     if (req.files[i].filename !== undefined) {
//                         let current = `${process.env.GCS_URL}${req.files[i].filename}`;
//                         urlsAlbumPictures.push(current);
//                     }
//                 }
//                 let album = {
//                     name: req.body.name,
//                     pictures: urlsAlbumPictures,
//                 };
//                 UserModel.updateOne(
//                     { _id: req.auth.userId },
//                     { $push: { albums: album } }
//                 )
//                     .then(() =>
//                         res.status(201).json({
//                             message: "Album sauvegardé dans la base de donnée!",
//                             newAlbum: album,
//                         })
//                     )
//                     .catch(() =>
//                         res.status(400).json({
//                             message:
//                                 "Quelque chose a planté durant la modification..",
//                         })
//                     );
//             }
//         })
//         .catch(() =>
//             res.status(400).json({
//                 message: "On ne trouve pas d'utilisateur possédant cet id",
//             })
//         );
// };

// exports.getProfile = (req, res, next) => {
//     UserModel.findOne({ pseudo: req.params.pseudo }, (error, data) => {
//         if (error) {
//             res.status(404).json({ error });
//         } else {
//             return res.status(200).json(data);
//         }
//     });
// };

// exports.followUser = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then((user) => {
//             if (user._id != req.auth.userId) {
//                 return res
//                     .status(401)
//                     .json({ message: "Requête non-autorisée" });
//             } else {
//                 UserModel.updateOne(
//                     { _id: req.auth.userId },
//                     { $push: { following: req.body.pseudo } }
//                 )
//                     .then(() =>
//                         res.status(201).json({
//                             message: "Vous suivez maintenant cet utilisateur",
//                         })
//                     )
//                     .catch(() =>
//                         res.status(500).json({
//                             message:
//                                 "Notre serveur ne souhaite pas que vous vous socialisez",
//                         })
//                     );
//             }
//         })
//         .catch(() =>
//             res.status(404).json({
//                 message:
//                     "Nous ne retrouvons pas cet utilisateur dans notre base de données",
//             })
//         );
// };

// exports.unfollowUser = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then((user) => {
//             if (user._id != req.auth.userId) {
//                 return res
//                     .status(401)
//                     .json({ message: "Requête non-autorisée" });
//             } else {
//                 UserModel.updateOne(
//                     { _id: req.auth.userId },
//                     { $pull: { following: req.body.pseudo } }
//                 )
//                     .then(() =>
//                         res.status(201).json({
//                             message: "Vous ne suivez plus cet utilisateur",
//                         })
//                     )
//                     .catch(() =>
//                         res.status(500).json({
//                             message:
//                                 "Notre serveur souhaite que vous vous socialisez un peu plus...",
//                         })
//                     );
//             }
//         })
//         .catch(() =>
//             res.status(404).json({
//                 message:
//                     "Nous ne retrouvons pas cet utilisateur dans notre base de données",
//             })
//         );
// };

// exports.newFollower = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then(() => {
//             UserModel.updateOne(
//                 { _id: req.params.id },
//                 { $push: { followers: req.body.pseudo } }
//             )
//                 .then(() =>
//                     res.status(201).json({
//                         message: "Un utilisateur a commencé à vous suivre!",
//                     })
//                 )
//                 .catch(() =>
//                     res.status(500).json({
//                         message:
//                             "Notre serveur ne souhaite pas que la popularité vous monte à la tête",
//                     })
//                 );
//         })
//         .catch(() =>
//             res.status(404).json({
//                 message:
//                     "Nous ne retrouvons pas cet utilisateur dans notre base de données",
//             })
//         );
// };

// exports.lostFollower = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then(() => {
//             UserModel.updateOne(
//                 { _id: req.params.id },
//                 { $pull: { followers: req.body.pseudo } }
//             )
//                 .then(() =>
//                     res.status(201).json({
//                         message: "Un utilisateur a arrêté à vous suivre!",
//                     })
//                 )
//                 .catch(() =>
//                     res.status(500).json({
//                         message:
//                             "Notre serveur ne souhaite pas voir votre popularité défaillir",
//                     })
//                 );
//         })
//         .catch(() =>
//             res.status(404).json({
//                 message:
//                     "Nous ne retrouvons pas cet utilisateur dans notre base de données",
//             })
//         );
// };

// exports.setCoverPicture = (req, res, next) => {
//     UserModel.findOne({ _id: req.params.id })
//         .then((user) => {
//             if (user._id != req.auth.userId) {
//                 return res
//                     .status(401)
//                     .json({ message: "Requête non-autorisée" });
//             } else {
//                 if (
//                     user.coverPicture === undefined ||
//                     user.coverPicture === null
//                 ) {
//                     handleCoverPicture(req, res);
//                 } else {
//                     const originalname = user.coverPicture.split(
//                         process.env.GCS_SPLIT_STRING
//                     )[1];
//                     console.log(originalname);
//                     const file = gcFiles.file(originalname);
//                     file.delete()
//                         .then(() => {
//                             handleCoverPicture(req, res);
//                         })
//                         .catch((error) => {
//                             console.log(error);
//                             res.status(401).json({ error });
//                         });
//                 }
//             }
//         })
//         .catch((err) =>
//             res.status(404).json({
//                 message:
//                     "Notre serveur ne trouve aucun utilisateur possédant cet id",
//             })
//         );
// };
