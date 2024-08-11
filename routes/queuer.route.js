const express = require("express");
const router = express.Router();
const queuerController = require("../controllers/queuer.controller.js");
const { checkAdmin } = require("../middlewares/auth.middleware.js");

router.post("/", queuerController.addQueuer);
router.get("/", checkAdmin, queuerController.getAllQueuers);
router.delete("/:id", checkAdmin, queuerController.deleteQueuer);
module.exports = router;
