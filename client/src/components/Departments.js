import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { Button } from '@mui/material';
import './../App.css';
import 'react-notifications/lib/notifications.css';

//kokeile importtaa kaikki kerrallaan
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function Departments({ userIdProps, updateDepartmentsProps }) {
  const [departments, setDepartments] = useState({});

  const [updateDepartmentsDelete, setUpdateDepartmentsDelete] = useState(0);

  // Get departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
      //console.log('useEffect departments-data on : ' + response.data);
      setDepartments(response.data);
    })
  }, [])

  //Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartmentsProps, userIdProps, updateDepartmentsDelete]) // tarvitseeko userId? jos tarvitsee, muuta muutkin useEffectit

  const deleteDepartment = (id) => {
      Axios.post('http://localhost:3001/deletedepartment', {
        userid: userIdProps,
        departmentid: id
      }).then(function (response) {
        //console.log(response.data.errno);
        if (response.data.errno === 1451) {
          return ( // onko return tarpeen?
              NotificationManager.error('Please remove all employees from the department before deleting.', 'Error', 6000)
          )
        }
      }).catch(function (error) {
        console.log(error);
      })
      if (updateDepartmentsDelete === 0) { // tee funktioksi (boolean?)
        setUpdateDepartmentsDelete(1);
      } else {
        setUpdateDepartmentsDelete(0);
      }
  }

  return (
    <div className='employeesanddepartments'>
      <h4>Departments</h4>
      <TableContainer
        component={Paper}
        sx={{ height: '35em' }}
      >
        <Table
          sx={{ minWidth: 650 }}
          stickyHeader
          arial-label='simple table'
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Field</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(departments).map(([key, department]) => (
              <TableRow
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>{department.name}</TableCell>
                <TableCell>{department.field}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteDepartment(department.departmentId)}>DELETE</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <NotificationContainer />
    </div>
  )
}