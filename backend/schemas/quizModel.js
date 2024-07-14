const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  answer: {
    type: String,
    required: true,
  }
});

const quizModel = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    title: {
      type: String,
      required: true,
    },
    max_marks: {
      type: Number,
      required: true,
    },
    questions: [questionSchema],
    total_attended: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("quiz", quizModel);

module.exports = Quiz;