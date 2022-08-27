const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { getAllUsers, getSingleUser, deleteSingleUser, updateUserDetails, createSingleUser } = require('../controllers/users');
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getAllUsers)
    .post(createSingleUser);

router.route('/:id')
    .get(getSingleUser)
    .delete(deleteSingleUser)
    .put(updateUserDetails);

module.exports = router;