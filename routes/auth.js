const express = require("express");
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logOut } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route('/register')
    .post(register);

router.route('/login')
    .post(login);

router.route('/me')
    .get(protect, getMe);
module.exports = router;