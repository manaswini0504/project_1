import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import UserHome from "./UserHome"
import { Container } from 'react-bootstrap';

import AllQuizes from './AllQuizes';
import AttendedQuiz from '../user/AttendedQuiz';
import AllAttendees from '../admin/AllAttendees';


const Dashboard = () => {
   const [selectedComponent, setSelectedComponent] = useState('home');

   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserHome />
         case 'allquizes':
            return <AllQuizes />
         case 'attendedquiz':
            return <AttendedQuiz />
         case 'allattendees':
            return <AllAttendees />
         default:
            return <UserHome />

      }
   };
   return (
      <>
         <NavBar setSelectedComponent={setSelectedComponent} />
         <Container className='my-3'>
            {renderSelectedComponent()}
         </Container>
      </>
   );
};

export default Dashboard;