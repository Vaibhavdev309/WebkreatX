const router = require("express").Router();
const {
  checkout,
  doPayout,
  createRefund,
} = require("../controllers/paymentController");
const verifyJWT = require("../middleware/verifyJWT");
router.post("/create-checkout-session", checkout);
router.post("/payouts", doPayout);
router.post("/create", createRefund);

module.exports = router;
