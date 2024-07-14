// import React, { useEffect, useState, useContext } from 'react'
// import axiosInstance from './AxiosInstance'
// import { Button, message } from 'antd'
// import { UserContext } from '../../App';
// import { Link, useNavigate } from 'react-router-dom';

// const AllQuizes = () => {
//    const user = useContext(UserContext)
//    const [allquizes, setAllQuizes] = useState([])
//    const navigate = useNavigate()

//    const fetchAllQuizes = async () => {
//       try {
//          const res = await axiosInstance.get('/api/allusers/allquizes')

//          if (res.data.success) {
//             setAllQuizes(res.data.allQuizes)
//          }

//       } catch (error) {
//          console.log(error)
//       }
//    }

//    useEffect(() => {
//       fetchAllQuizes()
//    }, [])


//    const handleStartQuiz = async (quizId) => {
//       try {
//          const res = await axiosInstance.post(`/api/user/attendingquiz/${quizId}`, {}, {
//             headers: {
//                "Authorization": `Bearer ${localStorage.getItem('token')}`
//             }
//          })
//          if (res.data.success) {
//             localStorage.setItem("QuizData",JSON.stringify(res.data.QuizData))
//             navigate(`/attending-quiz/${quizId}`)
//          }
//          else{
//             alert(res.data.error)
//          }
//       } catch (error) {
//          console.log(error)
//       }
//    }

//    const changeTime = (timestamp) => {
//       const date = new Date(timestamp);
//       return date.toLocaleTimeString();
//    };
//    return (
//       <div className='p-2 course-container'>
//          {allquizes.length > 0 ?
//             allquizes.map((quiz, i) => (
//                <div key={i} className='course'>
//                   <div className="card1">
//                      <div className="desc">
//                         <h3>{quiz.title}</h3>
//                         <p className="details">Total Questions: {quiz.questions.length}</p>
//                         <p className="details">Total Marks: {quiz.max_marks}</p>
//                         <p className="details">Created At: {changeTime(quiz.createdAt)}</p>
//                      </div>
//                      <p className="details left-p">Total Attended: {quiz.total_attended}</p>
//                      {
//                         user.userLoggedIn === true && user.userData.type !== 'admin' ? <Button onClick={() => handleStartQuiz(quiz._id)} className='start-btn'>Start</Button>
//                            : null
//                      }

//                   </div>
//                </div>
//             ))
//             : <p>No Quizes at the moment</p>
//          }
//       </div>
//    )
// }

// export default AllQuizes


import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, message } from 'antd';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

const AllQuizes = () => {
   const user = useContext(UserContext);
   const [allquizes, setAllQuizes] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchAllQuizes = async () => {
         try {
            const res = await axiosInstance.get('/api/allusers/allquizes');
            if (res.data.success) {
               setAllQuizes(res.data.allQuizes);
            }
         } catch (error) {
            console.log(error);
         }
      };
      fetchAllQuizes();
   }, []);

   const handleStartQuiz = async (quizId) => {
      try {
         const res = await axiosInstance.post(`/api/user/attendingquiz/${quizId}`, {}, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });
         if (res.data.success) {
            localStorage.setItem("QuizData", JSON.stringify(res.data.QuizData));
            navigate(`/attending-quiz/${quizId}`);
         }
      } catch (error) {
         if (error.response && error.response.status === 409) {
            message.info(error.response.data.error);
         } else {
            message.error("An error occurred");
         }
         console.log(error);
      }
   };



   const changeTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
   };

   return (
      <div className='p-2 course-container'>
         {allquizes.length > 0 ? (
            allquizes.map((quiz, i) => (
               <div key={i} className='course'>
                  <div className="card1">
                     <div className="desc">
                        <h3>{quiz.title}</h3>
                        <p className="details">Total Questions: {quiz.questions.length}</p>
                        <p className="details">Total Marks: {quiz.max_marks}</p>
                        <p className="details">Created At: {changeTime(quiz.createdAt)}</p>
                     </div>
                     <p className="details left-p">Total Attended: {quiz.total_attended}</p>
                     {user.userLoggedIn && user.userData.type !== 'admin' && (
                        <Button onClick={() => handleStartQuiz(quiz._id)} className='start-btn'>Start</Button>
                     )}
                  </div>
               </div>
            ))
         ) : (
            <p>No Quizes at the moment</p>
         )}
      </div>
   );
};

export default AllQuizes;