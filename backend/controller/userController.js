const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userModel");
const Quiz = require("../schemas/quizModel");
const attendingquizSchema = require("../schemas/attendingQuiz");

//for register
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////for the login
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////sending all quizes
const getAllQuizController = async (req, res) => {
  try {
    const allQuizes = await Quiz.find();

    if (!allQuizes) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      allQuizes: allQuizes,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

////quiz attending
const attendingQuizController = async (req, res) => {
  try {
    // Check if quiz exists
    const quizExists = await Quiz.findById(req.params.quizId);
    if (!quizExists) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    // Check if user has already attended the quiz
    const quizAttended = await attendingquizSchema.findOne({
      userId: req.body.userId,
      quizId: req.params.quizId,
    });

    if (!quizAttended) {
      const attendedQuiz = new attendingquizSchema({
        userId: req.body.userId,
        quizId: req.params.quizId,
      });

      // Increment total_attended for the quiz
      const quiz = await Quiz.findByIdAndUpdate(
        req.params.quizId,
        { $inc: { total_attended: 1 } },
        { new: true }
      );
      await attendedQuiz.save();

      return res.status(200).json({
        success: true,
        QuizData: quiz,
      });
    } else {
      return res.status(409).json({
        success: false,
        error: "You have already attempted this quiz",
      });
    }
  } catch (error) {
    console.error("Error in attendingQuizController:", error.message);
    return res.status(500).json({
      success: false,
      error: `Error in Saving the Attendance: ${error.message}`,
    });
  }
};

////storing result
const storeResultController = async (req, res) => {
  const { result, userId } = req.body;
  const { quizid } = req.params;
  try {
    const quizData = await attendingquizSchema.findOne(
      {
        quizId: quizid,
        userId
      }
    );

    if (!quizData) {
      return res.status(404).json({
        success: false,
        message: "No quiz data found for the provided user ID",
      });
    }

    quizData.result.push(result);
    // console.log(quizData);
    await quizData.save();
    return res.status(201).json({
      success: true,
      message: "Your answers are recorded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`,
    });
  }
};

////sending result to user
const sendingResultToUserController = async (req, res) => {
  const { userId } = req.body;
  try {
    const quizResult = await attendingquizSchema.findOne({ userId: userId });
    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: "No Result Found",
      });
    }

    // const quiz = await Quiz.findById(quizResult.quizId);
    // const totalMarks = quiz.max_marks

    return res.status(201).json({
      success: true,
      data: quizResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`,
    });
  }
};

////all quiz enrolled
const allQuizEnrolledController = async (req, res) => {
  try {
    const allQuiz = await attendingquizSchema.find({
      userId: req.body.userId,
    });

    if (!allQuiz) {
      return res.status(404).json({
        success: false,
        message: "No Data Available",
      });
    }
    return res.status(201).json({
      success: true,
      data: allQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getAllQuizController,
  attendingQuizController,
  storeResultController,
  sendingResultToUserController,
  allQuizEnrolledController,
};