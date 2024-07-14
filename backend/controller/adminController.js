const attendingquizSchema = require("../schemas/attendingQuiz");
const Quiz = require("../schemas/quizModel");

const quizPostingController = async (req, res) => {
  try {
    const { userId, title, max_marks, questions } = req.body;

    const newQuiz = new Quiz({
      userId,
      title,
      max_marks: parseInt(max_marks),
      questions,
    });

    await newQuiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

const allQuizEnrolledController = async (req, res) => {
  try {
    const allQuiz = await attendingquizSchema.find();
    
    return res.status(200).json({
      success: true,
      data: allQuiz,
    });
  } catch (error) {
    console.error(`Server Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`,
    });
  }
};

module.exports = {
  quizPostingController,
  allQuizEnrolledController,
};