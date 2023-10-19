const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const password = require("../middleware/password");
const signupCtrl = require("../controllers/users/signup");
const signinCtrl = require("../controllers/users/signin");
const patchOneCtrl = require("../controllers/users/patchOne");
const patchTripCtrl = require("../controllers/users/patchTrip");
const deleteTripCtrl = require("../controllers/users/deleteTrip");
const putTripCtrl = require("../controllers/users/putTrip");
const checkMailCtrl = require("../controllers/users/checkMail");

router.post("/signup", password, signupCtrl.signup);
router.post("/signin", signinCtrl.signin);
router.patch("/users/:id", auth, patchOneCtrl.patchOne);
router.patch("/users/:id/trip", auth, multer, patchTripCtrl.patchTrip);
// router.patch(
//     "/users/:id/setProfilePicture",
//     auth,
//     multer,
//     userCtrl.setProfilePicture
// );
router.delete("/users/:id/trip/:tripTitle", auth, deleteTripCtrl.deleteTrip);
router.put("/users/:id/trip", auth, putTripCtrl.putTrip);
router.get("/checkMail/:email", checkMailCtrl.checkMail);
// router.patch("/userProfile/:id", auth, multer, userCtrl.uploadUserPictures);
// router.put("/setAlbum/:userId", auth, multer, userCtrl.uploadAlbum);
// router.put("/followUser/:id", auth, userCtrl.followUser);
// router.put("/unfollowUser/:id", auth, userCtrl.unfollowUser);
// router.put("/newFollower/:id", auth, userCtrl.newFollower);
// router.put("/lostFollower/:id", auth, userCtrl.lostFollower);
// router.get("/userProfile/:pseudo", auth, userCtrl.getProfile);
// router.put("/setCoverPicture/:id", auth, multer, userCtrl.setCoverPicture);

module.exports = router;
