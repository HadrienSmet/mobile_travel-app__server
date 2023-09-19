const express = require("express");
const router = express.Router();
const tipsCtrl = require("../controllers/tips");

router.delete("/users/:userId/tips/:tipsId", tipsCtrl.deleteTips);

router.get("/tips", tipsCtrl.getEveryTips);
router.get("/users/:userId/tips", tipsCtrl.getUserTips);
router.get("/users/:userId/tips/:tripTitle", tipsCtrl.getPreviousTripTips);

router.patch("/users/:userId/tips/:tipsId", tipsCtrl.patchTips);

router.post("/tips", tipsCtrl.postTips);

module.exports = router;
