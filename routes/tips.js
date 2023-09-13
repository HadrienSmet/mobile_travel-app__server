const express = require("express");
const router = express.Router();
const tipsCtrl = require("../controllers/tips");

router.get("/users/:userId/tips", tipsCtrl.getUserTips);
router.get("/users/:userId/tips/:tripTitle", tipsCtrl.getPreviousTripTips);
router.post("/tips", tipsCtrl.postTips);
router.patch("/users/:userId/tips/:tipsId", tipsCtrl.patchTips);
router.delete("/users/:userId/tips/:tipsId", tipsCtrl.deleteTips);

module.exports = router;
