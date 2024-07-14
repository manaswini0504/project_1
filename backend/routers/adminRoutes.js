const express = require("express");

const authMiddleware = require("../middlewares/authMiddlewares");
const {
  registerController,
  loginController,
} = require("../controller/userController");
const { quizPostingController, allQuizEnrolledController } = require("../controller/adminController");

const router = express.Router();

router.post("/postquiz", authMiddleware, quizPostingController);

router.get("/allattendees", authMiddleware, allQuizEnrolledController)

module.exports = router;