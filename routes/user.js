const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const password = require("../middleware/password");
const userCtrl = require("../controllers/user");

router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login);
router.patch("/userProfile/:id", auth, multer, userCtrl.uploadUserPictures);
router.patch("/patchProfile/:id", auth, multer, userCtrl.patchProfileData);
router.put("/setAlbum/:userId", auth, multer, userCtrl.uploadAlbum);
router.put("/pushTrip/:userId", auth, userCtrl.addNewTrip);
router.put("/followUser/:id", auth, userCtrl.followUser);
router.put("/unfollowUser/:id", auth, userCtrl.unfollowUser);
router.put("/newFollower/:id", auth, userCtrl.newFollower);
router.put("/lostFollower/:id", auth, userCtrl.lostFollower);
router.get("/userProfile/:pseudo", auth, userCtrl.getProfile);
router.get("/checkMail/:email", userCtrl.checkMail);
router.put("/setCoverPicture/:id", auth, multer, userCtrl.setCoverPicture);

module.exports = router;
