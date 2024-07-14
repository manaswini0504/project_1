import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';
import AdminHome from '../admin/AdminHome';
import StudentHome from '../user/StudentHome';


const UserHome = () => {
   const user = useContext(UserContext);
   let content;
   {
      switch (user.userData.type) {
         case "admin":
            content = <AdminHome />
            break;
         case "student":
            content = <StudentHome />
            break;

         default:
            break;
      }
   }

   return (
      <Container>
         {content}
      </Container>
   );
};

export default UserHome;