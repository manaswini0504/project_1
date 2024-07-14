const mongoose = require("mongoose");

const attendingQuizModel = mongoose.Schema(
  {
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    result: [],
  },
  {
    timestamps: true,
  }
);

const attendingquizSchema = mongoose.model("attendingQuiz", attendingQuizModel);

module.exports = attendingquizSchema;