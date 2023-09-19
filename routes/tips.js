const express = require("express");
const router = express.Router();
const tipsCtrl = require("../controllers/tips");

router.delete("/users/:userId/tips/:tipsId", tipsCtrl.deleteTips);

router.get("/tips", tipsCtrl.getEveryTips);
router.get("/users/:userId/tips", tipsCtrl.getUserTips);
router.get("/users/:userId/tips/:tripTitle", tipsCtrl.getPreviousTripTips);

router.patch("/users/:userId/tips/:tipsId", tipsCtrl.patchTips);

router.patch("/user/:userId/likes/:tipsId", tipsCtrl.likeTips);
router.patch("/user/:userId/dislikes/:tipsId", tipsCtrl.dislikeTips);
router.patch("/user/:userId/removeLike/:tipsId", tipsCtrl.removeLike);
router.patch("/user/:userId/removeDislike/:tipsId", tipsCtrl.removeDislike);

router.post("/tips", tipsCtrl.postTips);

module.exports = router;
