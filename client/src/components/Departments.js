import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import EditSharp from '@mui/icons-material/EditSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import SaveSharp from '@mui/icons-material/SaveSharp';
import CancelSharp from '@mui/icons-material/CancelSharp';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Axios from 'axios';
import './../App.css';
import 'react-notifications/lib/notifications.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// 'userIdProps': sent from DepartmentsPage component. Specifies which user's data is handled.
// 'updateDepartmentsProps': sent from DepartmentsPage component. Used to trigger departments table re-render.
export default function Departments({ userIdProps, updateDepartmentsProps }) {
  const [departments, setDepartments] = useState({});
  const [departmentName, setDepartmentName] = useState('');
  const [departmentField, setDepartmentField] = useState('');

  // States for rendering new/updated data
  const [updateDepartments, setUpdateDepartments] = useState(false); // Changed to re-render departments table
  const [updateOnOff, setUpdateOnOff] = useState(false); // Changed to edit single department table row
  const [updateDepartmentId, setUpdateDepartmentId] = useState(); // Used to specify which table row is to be edited

  // Get departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
      setDepartments(response.data);
    })
  }, [])

  // Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartmentsProps, userIdProps, updateDepartments])

  const deleteDepartment = (id) => {
      Axios.post('http://localhost:3001/deletedepartment', {
        userid: userIdProps,
        departmentid: id
      }).then(function (response) {
        if (response.data.errno === 1451) {
            NotificationManager.error('Please remove all employees from the department before deleting.', 'Error', 6000)
        }
      })
      
      if (!updateDepartments) {
        setUpdateDepartments(true);
      } else {
        setUpdateDepartments(false);
      }
  }

  const updateDepartmentToDatabase = (id, department) => {
    let departmentname, departmentfield;

    departmentName === '' ? departmentname = department.name : departmentname = departmentName;
    departmentField === '' ? departmentfield = department.field : departmentfield = departmentField;

    Axios.put('http://localhost:3001/updatedepartment', {
      userid: userIdProps,
      departmentid: id,
      departmentname: departmentname,
      departmentfield: departmentfield
    })

    setDepartmentName('');
    setDepartmentField('');

    setUpdateOnOff(false);

    if (!updateDepartments) {
      setUpdateDepartments(true);
    } else {
      setUpdateDepartments(false);
    }
  }

  // Changes table's data row into editing mode
  const updateDepartmentOnOff = (id) => {
    setUpdateDepartmentId(id);
    if (!updateOnOff) {
      setUpdateOnOff(true);
    } else {
      setUpdateOnOff(false);
    }
  }

  // Used to specify which table row is to be edited. Returns 'true' for department to be edited (based on it's ID).
  const updateDepartmentIdFunction = (id) => {
    if (id === updateDepartmentId) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className='employeesanddepartments'>
      <TableContainer
        component={Paper}
        sx={{ height: '36.4em', background: 'rgb(249, 247, 244)' }}
      >
        <Table
          sx={{ minWidth: 650 }}
          stickyHeader
          arial-label='departments table'
          size='small'
        >
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Name</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Field</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}></TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/*
              Mapping departments into the table.
              If 'updateOnOff' and 'updateDepartmentIdFunction' are both 'true', row is rendered in editing mode.
            */}
            {Object.entries(departments).map(([key, department]) => (
              updateOnOff && updateDepartmentIdFunction(department.departmentId) 
                ?
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell>
                    <TextField
                      id='departmentname'
                      placeholder='Name'
                      defaultValue={department.name}
                      onChange={e => setDepartmentName(e.target.value)}
                      sx={{ width: '80%', bgcolor: 'white' }}
                      size='small'
                      inputProps={{ maxLength: 30 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id='departmentfield'
                      placeholder='Field'
                      defaultValue={department.field}
                      onChange={e => setDepartmentField(e.target.value)}
                      sx={{ width: '80%', bgcolor: 'white' }}
                      size='small'
                      inputProps={{ maxLength: 30 }}
                    />
                  </TableCell>
                  <TableCell width='5%'>
                    <SaveSharp
                      sx={{ color: 'rgb(80, 141, 34)' }}
                      fontSize='large'
                      onClick={() => updateDepartmentToDatabase(department.departmentId, departments[key])}
                    />
                  </TableCell>
                  <TableCell width='5%'>
                    <CancelSharp
                      sx={{ color: 'rgb(134, 133, 114)', marginTop: '6px' }}
                      fontSize='large'
                      onClick={() => setUpdateOnOff(false)}
                    />
                  </TableCell>
                  </TableRow>
                :
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>{department.name}</TableCell>
                    <TableCell>{department.field}</TableCell>
                    <TableCell width='5%'>
                      <EditSharp
                        sx={{ color: 'rgb(181, 150, 65)' }}
                        fontSize='large'
                        onClick={() => updateDepartmentOnOff(department.departmentId)}
                      />
                    </TableCell>
                    <TableCell width='5%'>
                      <DeleteSharp
                        sx={{ color: 'rgb(226, 108, 34)' }}
                        fontSize='large'
                        onClick={() => deleteDepartment(department.departmentId)}
                      />
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