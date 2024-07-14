import React, { useState, useEffect } from 'react'
import { styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AttendedQuiz = () => {
   const [allAttendedQuiz, setAllAttendedQuiz] = useState([])

   const fetchAllAttendedQuiz = async () => {
      try {
         const res = await axiosInstance.get('/api/user/allattendedquiz', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })

         if (res.data.success) {
            setAllAttendedQuiz(res.data.data)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      fetchAllAttendedQuiz()
   }, [])

   const makeRegularDateTime = (datetime) => {
      const regularDateTime = new Date(datetime).toLocaleString();
      return regularDateTime
   }

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Quiz ID</StyledTableCell>
                  {/* <StyledTableCell align="left">Quiz Name</StyledTableCell> */}
                  <StyledTableCell align="left">Total Score</StyledTableCell>
                  <StyledTableCell align="left">Attended At</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allAttendedQuiz.length > 0 ? (
                     allAttendedQuiz.map((quiz) => (
                        <StyledTableRow key={quiz._id}>
                           <StyledTableCell component="th" scope="row">
                              {quiz._id}
                           </StyledTableCell>
                           {/* <StyledTableCell component="th" scope="row">
                              {quiz.name}
                           </StyledTableCell> */}
                           <StyledTableCell component="th" scope="row">
                              {quiz.result[0].totalScore}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {makeRegularDateTime(quiz.createdAt)}
                           </StyledTableCell>

                        </StyledTableRow>
                     )))
                     :
                     (<p className='px-2'>No quiz found</p>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default AttendedQuiz;