import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { Button, TextField } from '@mui/material';
import EditSharp from '@mui/icons-material/EditSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import SaveSharp from '@mui/icons-material/SaveSharp';
import CancelSharp from '@mui/icons-material/CancelSharp';
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
  const [departmentName, setDepartmentName] = useState('');
  const [departmentField, setDepartmentField] = useState('');

  const [updateDepartmentsDelete, setUpdateDepartmentsDelete] = useState(false);
  const [updateOnOff, setUpdateOnOff] = useState(false);
  const [updateDepartmentId, setUpdateDepartmentId] = useState();

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
      if (!updateDepartmentsDelete) {
        setUpdateDepartmentsDelete(true);
      } else {
        setUpdateDepartmentsDelete(false);
      }
  }

  const updateDepartmentToDatabase = (id, department) => {
    // VIIMEISTELE, muuta muuttujanimiä

    if (departments.find(department => department.name === departmentName) === undefined) {
      // TODO: kokeile laittaa muuttujat yhteen riviin
      let departmentname;
      let departmentfield;

      // TODO: selvitä voiko else-haaran tehdä tyhjäksi
      departmentName === '' ? departmentname = department.name : departmentname = departmentName;
      departmentField === '' ? departmentfield = department.field : departmentfield = departmentField;
      console.log('departmentname on: ' + departmentname);
      console.log('departmentfield on: ' + departmentfield);

      Axios.put('http://localhost:3001/updatedepartment', {
        userid: userIdProps,
        departmentid: id,
        departmentname: departmentname,
        departmentfield: departmentfield
      })

      setDepartmentName('');
      setDepartmentField('');

      setUpdateOnOff(false);
      if (!updateDepartmentsDelete) {
        setUpdateDepartmentsDelete(true); // muuta nimi
      } else {
        setUpdateDepartmentsDelete(false);
      }
    } else {
      NotificationManager.error('Department name is already in use!');
    }
  }

  const updateDepartmentOnOff = (id) => { // nimeä uudelleen
    setUpdateDepartmentId(id);
    if (!updateOnOff) {
      setUpdateOnOff(true);
    } else {
      setUpdateOnOff(false);
    }
  }

  const updateDepartmentIdFunction = (id) => { // muuta nimi
    if (id === updateDepartmentId) {
      return true;
    } else {
      return false;
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
                      size='small'
                      inputProps={{ maxLength: 30 }}
                    />
                  </TableCell>
                  <TableCell>
                    <SaveSharp
                      color='success'
                      fontSize='large'
                      onClick={() => updateDepartmentToDatabase(department.departmentId, departments[key])}
                    />
                    {/*<Button onClick={() =>
                      UpdateDepartmentToDatabase(department.departmentId, departments[key])}
                    >UPDATE</Button>*/}
                  </TableCell>
                  <TableCell>
                    <CancelSharp
                      color='action'
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
                    <TableCell>
                      <EditSharp
                        color='action'
                        fontSize='large'
                        onClick={() => updateDepartmentOnOff(department.departmentId)}
                      />
                      {/*<Button onClick={() => updateDepartmentOnOff(department.departmentId)}>UPDATE</Button>*/}
                    </TableCell>
                    <TableCell>
                      <DeleteSharp
                        color='warning'
                        fontSize='large'
                        onClick={() => deleteDepartment(department.departmentId)}
                      />
                      {/*<Button onClick={() => deleteDepartment(department.departmentId)}>DELETE</Button>*/}
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


/*

                    <TableCell>
                      {updateOnOff ? 'update ON' : 'update OFF'}
                    </TableCell>





*/