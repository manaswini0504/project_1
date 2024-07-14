import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import axiosInstance from '../common/AxiosInstance';
import { message } from 'antd';

const QuizComponent = () => {
   const navigate = useNavigate();
   const quizDataString = localStorage.getItem("QuizData");
   const quizData = quizDataString ? JSON.parse(quizDataString) : null;
   const questions = quizData ? quizData.questions : [];

   const [userResponses, setUserResponses] = useState([]);
   const [currQuestion, setCurrQuestion] = useState(0);
   const [correctAnswers, setCorrectAnswers] = useState(0);
   const [clickedOption, setClickedOption] = useState(null);

   const updateScore = () => {
      const currentQuestion = questions[currQuestion];
      const isCorrect = currentQuestion && currentQuestion.options[clickedOption] === currentQuestion.answer;
      const newResponses = [...userResponses, { questionIndex: currQuestion, isCorrect }];
      const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;

      return { newResponses, newCorrectAnswers };
   };

   const changeQuestion = async () => {
      console.log("HIT")
      const { newResponses, newCorrectAnswers } = updateScore();

      setUserResponses(newResponses);
      setCorrectAnswers(newCorrectAnswers);

      if (currQuestion < questions.length - 1) {
         setCurrQuestion(currQuestion + 1);
         setClickedOption(null);
      } else {
         const result = {
            totalAnswer: newCorrectAnswers,
            totalQuestions: questions.length,
            userResponses: newResponses,
            totalScore: ((newCorrectAnswers / questions.length) * quizData.max_marks).toFixed(0)
         };

         // Await the axios call
         const res = await axiosInstance.post(`/api/user/postingresult/${quizData._id}`, { result }, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });

         if (res.data.success) {
            message.success(res.data.message);
            localStorage.removeItem('QuizData');
            navigate('/result');
         }
      }
   };

   return (
      <>
         <NavBar />
         <div className='d-flex justify-content-center'>
            <div className="contents">
               <div className="question-content">
                  <p>
                     {currQuestion + 1}. {questions[currQuestion]?.description}
                  </p>
               </div>
               <div className="option-content">
                  {questions[currQuestion]?.options.map((option, index) => (
                     <button
                        key={index}
                        className={`btn ${clickedOption === index ? "clicked-green" : ""}`}
                        onClick={() => setClickedOption(index)}
                     >
                        {option}
                     </button>
                  ))}
               </div>
               <div className="btn">
                  <a className="btnfos btnfos-5" onClick={changeQuestion}>
                     Next
                  </a>
               </div>
            </div>
         </div>
      </>
   );
};

export default QuizComponent;