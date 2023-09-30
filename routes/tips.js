const express = require("express");
const router = express.Router();
const deleteOneCtrl = require("../controllers/tips/deleteOne");
const dislikeOneCtrl = require("../controllers/tips/dislikeOne");
const getAllCtrl = require("../controllers/tips/getAll");
const getUserTipsCtrl = require("../controllers/tips/getUserTips");
const likeOneCtrl = require("../controllers/tips/likeOne");
const patchOneCtrl = require("../controllers/tips/patchOne");
const postOneCtrl = require("../controllers/tips/postOne");
const removeLikeCtrl = require("../controllers/tips/removeLike");
const removeDislikeCtrl = require("../controllers/tips/removeDislike");

router.delete("/users/:userId/tips/:tipsId", deleteOneCtrl.deleteOne);
router.get("/tips", getAllCtrl.getAll);
router.get("/users/:userId/tips", getUserTipsCtrl.getUserTips);
router.patch("/users/:userId/tips/:tipsId", patchOneCtrl.patchOne);
router.patch("/user/:userId/likes/:tipsId", likeOneCtrl.likeOne);
router.patch("/user/:userId/dislikes/:tipsId", dislikeOneCtrl.dislikeOne);
router.patch("/user/:userId/removeLike/:tipsId", removeLikeCtrl.removeLike);
router.patch(
    "/user/:userId/removeDislike/:tipsId",
    removeDislikeCtrl.removeDislike
);
router.post("/tips", postOneCtrl.postOne);

module.exports = router;
