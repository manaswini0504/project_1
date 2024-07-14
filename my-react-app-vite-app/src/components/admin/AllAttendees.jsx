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


const AllAttendees = () => {
   const [allAttendees, setAllAttendees] = useState([])

   const fetchAllAttendees = async () => {
      try {
         const res = await axiosInstance.get('/api/admin/allattendees', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
         })

         if (res.data.success) {
            setAllAttendees(res.data.data)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      fetchAllAttendees()
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
                  <StyledTableCell align="left">User ID</StyledTableCell>
                  <StyledTableCell align="left">Total Score</StyledTableCell>
                  <StyledTableCell align="left">Attended At</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allAttendees.length > 0 ? (
                     allAttendees.map((attendee) => (
                        <StyledTableRow key={attendee._id}>
                           <StyledTableCell component="th" scope="row">
                              {attendee._id}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {attendee.userId}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {attendee.result[0].totalScore}
                           </StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              {makeRegularDateTime(attendee.createdAt)}
                           </StyledTableCell>

                        </StyledTableRow>
                     )))
                     :
                     (<p className='px-2'>No attendee found</p>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default AllAttendees;