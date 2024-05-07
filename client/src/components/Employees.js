import React, { useEffect, useState } from "react";
import Axios from 'axios';
import './../App.css';

//kokeile importtaa kaikki kerrallaan
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Employees({ employeesProps, userIdProps }) {
  const [departments, setDepartments] = useState({});

  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
      //console.log('useEffect departments-data on : ' + response.data);
      setDepartments(response.data);
    })
  }, [])

  // VIIMEISTELE
  const kokeilu = (input) => {
    if (departments[input - 1] === null) {
      return (
        <div>undefined</div>
      )
    } else {
      return (
        <div>{departments[input - 1].name}</div>
      )
    }
  }

  return (
    <div className="employeesanddepartments">
      <h4>Employees</h4>
      <TableContainer
        component={Paper}
        sx={{height: '20em'}}
      >
        <Table sx={{ minWidth: 650 }} arial-label="employee table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align='left'>First Name</TableCell>
              <TableCell align='left'>Last Name</TableCell>
              <TableCell align='left'>Job Title</TableCell>
              <TableCell align='left'>Department</TableCell>
              <TableCell align='left'>Seniority</TableCell>
              <TableCell align='left'>Salary (monthly)</TableCell>
              <TableCell align='left'>Starting Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(employeesProps).map(([key, employee]) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{kokeilu(employee.departmentId)}</TableCell>
                  <TableCell>{employee.seniority}</TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>{employee.startingDate.substring(0, 10)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}