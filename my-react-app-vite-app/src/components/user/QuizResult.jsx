import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import NavBar from '../common/NavBar';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuizResult = () => {
   const [userResult, setUserResult] = useState({});
   const navigate = useNavigate()

   const fetchResult = async () => {
      try {
         const res = await axiosInstance.get('/api/user/getresult', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
         });

         if (res.data.success) {
            const { result } = res.data.data;
            setUserResult(result);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleTryAgainClick = () => {
      navigate('/dashboard')
   };

   useEffect(() => {
      fetchResult();

   }, []);

   return (
      <>
         <NavBar />
         <Container className='d-flex justify-content-center align-item-center p-5'>

            <div className='result-box'>
               <p>
                  Out of {userResult[0]?.totalQuestions} questions,
                  <br />
                  you corrected {userResult[0]?.totalAnswer} questions.
               </p>
               <br />
               <p>Your total score is {userResult[0]?.totalScore}.</p>

               <Button className='btn-start p-3' onClick={handleTryAgainClick}>
                  Go to home
               </Button>
            </div>
         </Container>
      </>
   );
};

export default QuizResult;