const express = require("express");

const authMiddleware = require("../middlewares/authMiddlewares");
const {
  registerController,
  loginController,
  getAllQuizController,
  attendingQuizController,
  storeResultController,
  sendingResultToUserController,
  allQuizEnrolledController,
} = require("../controller/userController");

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/allquizes", getAllQuizController);

router.post("/attendingquiz/:quizId", authMiddleware, attendingQuizController);

router.post("/postingresult/:quizid", authMiddleware, storeResultController);

router.get("/getresult", authMiddleware, sendingResultToUserController);

router.get("/allattendedquiz", authMiddleware, allQuizEnrolledController)

module.exports = router;