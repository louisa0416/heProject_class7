const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");
/* GET users listing. */
router.post("/sign_up", handleErrorAsync(userControllers.sign_up));
router.post("/sign_in", handleErrorAsync(userControllers.sign_in));
router.post(
  "/updatePassword",
  isAuth,
  handleErrorAsync(userControllers.updatePassword)
);
router.get("/profile", isAuth, handleErrorAsync(userControllers.getProfile));
router.patch(
  "/profile",
  isAuth,
  handleErrorAsync(userControllers.updateProfile)
);

module.exports = router;
