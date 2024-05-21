import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { TextField } from '@mui/material';
import { Button } from "@mui/material";
import './../App.css';

//kokeile importtaa kaikki kerrallaan
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Employees({ userIdProps, updateEmployeesProps }) {
  const [departments, setDepartments] = useState({});
  const [departmentsNames, setDepartmentsNames] = useState({});
  const [employees, setEmployees] = useState({});

  const [firstName, setFirstName] = useState('');

  const [updateEmployeesDelete, setUpdateEmployeesDelete] = useState(0);
  const [updateOnOff, setUpdateOnOff] = useState(false);
  const [updateEmployeeId, setUpdateEmployeeId] = useState();

  //Get employees and departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getemployees', { params: { userId: userIdProps} }).then((response) => {
    setEmployees(response.data);
  })
  Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
    //console.log('useEffect departments-data on : ' + response.data);
    setDepartments(response.data);
  })
}, [])

  //Update employees table
  useEffect(() => {
    Axios.get('http://localhost:3001/getemployees', { params: { userId: userIdProps } }).then((response) => {
      setEmployees(response.data);
    })
  }, [updateEmployeesProps, userIdProps, updateEmployeesDelete]) // tarvitseeko userId? jos tarvitsee, muuta muutkin useEffectit


  const deleteEmployee = (id) => {
    //console.log('Employee.js userIdProps on: ' + userIdProps);
    Axios.post('http://localhost:3001/deleteemployee', {
      userid: userIdProps,
      employeeid: id
    })
    if (updateEmployeesDelete === 0) { // tee funktioksi (boolean?)
      setUpdateEmployeesDelete(1);
    } else {
      setUpdateEmployeesDelete(0);
    }
  }

  const UpdateEmployee = (id) => {
    Axios.put('http://localhost:3001/updateemployee', {
      userid: userIdProps,
      employeeid: id,
      firstname: firstName
    })
    setUpdateOnOff(false);
    if (updateEmployeesDelete === 0) { // tee funktioksi (boolean?)
      setUpdateEmployeesDelete(1);
    } else {
      setUpdateEmployeesDelete(0);
    }
  }

  const updateEmployeeOnOff = (id) => { //nimeä uudelleen
    setUpdateEmployeeId(id);
    if (!updateOnOff) {
      setUpdateOnOff(true);
    } else {
      setUpdateOnOff(false);
    }
    console.log('updateOnOff on: ' + updateOnOff);
  }

  // VIIMEISTELE
  const kokeilu = (input) => {
    let osastojenNimet = [];
    let departmentName;
    for (let i = 0; i < Object.keys(departments).length; i++) {
      osastojenNimet.push(departments[i]);
    }
    osastojenNimet.forEach((element) => {
      if (element.departmentId === input) {
        departmentName = element.name
        //console.log("Employees.js osaston nimi on: " + element.name);
      }
    })
    return (
      <div>
        {departmentName}
      </div>
    )
  }

  const UpdateEmployeeIdFunction = (id) => { // muuta nimi
    if (id === updateEmployeeId) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="employeesanddepartments">
      <h4>Employees</h4>
      <TableContainer
        component={Paper}
        sx={{ height: '35em' }}
      >
        <Table
          sx={{ minWidth: 650 }}
          stickyHeader
          arial-label="employee table"
          size="small"
        >
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
              {Object.entries(employees).map(([key, employee]) => (
                updateOnOff && UpdateEmployeeIdFunction(employee.employeeId)
                  ?
                    <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell>jep</TableCell>
                    <TableCell>
                      <Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>UPDATE</Button>
                    </TableCell>
                    </TableRow>
                  :
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
                  <TableCell>
                    <Button onClick={() => deleteEmployee(employee.employeeId)}>DELETE</Button>
                  </TableCell>
                  <TableCell>
                        <Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>UPDATE</Button>
                  </TableCell>
                  <TableCell>
                    {updateOnOff ? 'update ON' : 'update OFF'}
                  </TableCell>
                </TableRow> 
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}


/*

<TableBody>
              {Object.entries(employees).map(([key, employee]) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {updateOnOff && UpdateEmployeeIdFunction(employee.employeeId)
                      ?
                        <TextField
                        id='firstname'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        size='small'
                        />
                      :
                        employee.firstName
                    }
                  </TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{kokeilu(employee.departmentId)}</TableCell>
                  <TableCell>{employee.seniority}</TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>{employee.startingDate.substring(0, 10)}</TableCell>
                  <TableCell>
                    {updateOnOff && UpdateEmployeeIdFunction(employee.employeeId)
                      ?
                        <Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>CANCEL</Button>
                      :
                        <Button onClick={() => deleteEmployee(employee.employeeId)}>DELETE</Button>
                    }
                  </TableCell>
                  <TableCell>
                    {updateOnOff && UpdateEmployeeIdFunction(employee.employeeId)
                      ?
                        <Button onClick={() => UpdateEmployee(employee.employeeId)}>UPDATE TO DATABASE</Button>
                      :
                        <Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>UPDATE</Button>
                    }


                    
                  </TableCell>
                  <TableCell>
                    {updateOnOff ? 'update ON' : 'update OFF'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>




*/