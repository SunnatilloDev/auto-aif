const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { checkAdmin } = require("../middlewares/auth.middleware.js");

router.post("/", userController.addUser);
router.get("/", checkAdmin, userController.getAllUsers);
router.put("/:id", checkAdmin, userController.updateUser);
router.delete("/:id", checkAdmin, userController.deleteUser);
router.post("/isAdmin", userController.isAdmin);
router.post("/refreshUsersData", checkAdmin, userController.refreshUsersData);
module.exports = router;
