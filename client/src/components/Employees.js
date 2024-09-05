import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import moment from 'moment';
import Axios from 'axios';
import './../App.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Autocomplete from '@mui/material/Autocomplete';
import EditSharp from '@mui/icons-material/EditSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import SaveSharp from '@mui/icons-material/SaveSharp';
import CancelSharp from '@mui/icons-material/CancelSharp';

// 'userIdProps': sent from EmployeesPage component. Specifies which user's data is handled.
// 'updateEmployeesProps': sent from EmployeesPage component. Used to trigger employees table re-render.
export default function Employees({ userIdProps, updateEmployeesProps }) {
  const [departments, setDepartments] = useState({});
  const [employees, setEmployees] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobtitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [seniority, setSeniority] = useState('');
  const [salary, setSalary] = useState('');
  const [startingDate, setStartingDate] = useState('');

  // States for rendering new/updated data
  const [updateEmployees, setUpdateEmployees] = useState(false);
  const [updateOnOff, setUpdateOnOff] = useState(false);
  const [updateEmployeeId, setUpdateEmployeeId] = useState();

  //Get employees and departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getemployees', { params: { userId: userIdProps} }).then((response) => {
    setEmployees(response.data);
  })
  Axios.get('http://localhost:3001/getdepartments', { params: { userId: userIdProps } }).then((response) => {
    setDepartments(response.data);
  })
}, [])

  //Update employees table
  useEffect(() => {
    Axios.get('http://localhost:3001/getemployees', { params: { userId: userIdProps } }).then((response) => {
      setEmployees(response.data);
    })
  }, [updateEmployeesProps, userIdProps, updateEmployees])

  const deleteEmployee = (id) => {
    Axios.post('http://localhost:3001/deleteemployee', {
      userid: userIdProps,
      employeeid: id
    })

    if (!updateEmployees) {
      setUpdateEmployees(true);
    } else {
      setUpdateEmployees(false);
    }
  }

  const updateEmployeeToDatabase = (id, employee) => {
    let firstname, lastname, jobtitle, departmentid, employeeseniority, employeesalary, startingdate;

    firstName === '' ? firstname = employee.firstName : firstname = firstName;
    lastName === '' ? lastname = employee.lastName : lastname = lastName;
    jobTitle === '' ? jobtitle = employee.jobTitle : jobtitle = jobTitle;
    departmentId === '' ? departmentid = employee.departmentId : departmentid = departmentId;
    seniority === '' ? employeeseniority = employee.seniority : employeeseniority = seniority;
    salary === '' ? employeesalary = employee.salary : employeesalary = salary;
    startingDate === '' ? startingdate = employee.startingDate : startingdate = startingDate;

    Axios.put('http://localhost:3001/updateemployee', {
      userid: userIdProps,
      employeeid: id,
      firstname: firstname,
      lastname: lastname,
      jobtitle: jobtitle,
      departmentid: departmentid,
      seniority: employeeseniority,
      salary: employeesalary,
      startingdate: dayjs(startingdate).format('YYYY/MM/DD')
    })

    setFirstName('');
    setLastName('');
    setJobtitle('');
    setDepartmentId('');
    setSeniority('');
    setSalary('');
    setStartingDate('');

    setUpdateOnOff(false);
    if (!updateEmployees) {
      setUpdateEmployees(true);
    } else {
      setUpdateEmployees(false);
    }
  }

  // Changes table's data row into editing mode
  const updateEmployeeOnOff = (id) => {
    setUpdateEmployeeId(id);
    if (!updateOnOff) {
      setUpdateOnOff(true);
    } else {
      setUpdateOnOff(false);
    }
  }
  
  // Returns single department's name. Used for employees table row.
  const getDepartmentName = (id) => {
    let departmentNames = [];
    let departmentName;

    for (let i = 0; i < Object.keys(departments).length; i++) {
      departmentNames.push(departments[i]);
    }

    departmentNames.forEach((element) => {
      if (element.departmentId === id) {
        departmentName = element.name
      }
    })

    return (
      <div>
        {departmentName}
      </div>
    )
  }

  // Used to specify which table row is to be edited. Returns 'true' for employee to be edited (based on it's ID).
  const updateEmployeeIdFunction = (id) => {
    if (id === updateEmployeeId) {
      return true;
    } else {
      return false;
    }
  }

  // Menu to select departments
  const departmentsBox = (departmentsProps, id) => {
    const departmentNames = [];
    const departmentIds = [];

    Object.entries(departmentsProps).map(([key, department]) => (
      departmentNames.push(department.name.toString())
    ))
    Object.entries(departmentsProps).map(([key, department]) => (
      departmentIds.push(parseInt(department.departmentId))
    ))

    return (
      <Autocomplete
        options={departmentNames}
        defaultValue={id}
        renderInput={(params) => <TextField {...params} label='Department' />}
        onChange={(e, newValue) => {
          setDepartmentId(parseInt(departmentIds[departmentNames.indexOf(newValue)]));
        }}
        sx={{ width: 190, bgcolor: 'white' }}
        size='small'
      />
    )
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
          arial-label='employees table'
          size='small'
        >
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>First Name</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Last Name</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Job Title</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Department</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Seniority</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Salary (monthly)</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}>Starting Date</TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}></TableCell>
              <TableCell align='left' sx={{ backgroundColor: 'rgb(235, 229, 216)' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {/*
              Mapping employees into the table.
              If 'updateOnOff' and 'updateEmployeeIdFunction' are both 'true', row is rendered in editing mode.
            */}
              {Object.entries(employees).map(([key, employee]) => (
                updateOnOff && updateEmployeeIdFunction(employee.employeeId)
                  ?
                    <TableRow
                      key={key}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell>
                      <TextField
                        id='firstname'
                        placeholder='First Name'
                        defaultValue={employee.firstName}
                        onChange={e => setFirstName(e.target.value)}
                        sx={{ width: '112%', bgcolor: 'white' }}
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='lastname'
                        placeholder='Last Name'
                        defaultValue={employee.lastName}
                        onChange={e => setLastName(e.target.value)}
                        sx={{ width: '112%', bgcolor: 'white' }}
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='jobtitle'
                        placeholder='Job Title'
                        defaultValue={employee.jobTitle}
                        onChange={e => setJobtitle(e.target.value)}
                        sx={{ width: '112%', bgcolor: 'white' }}
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>

                    <TableCell>
                      {departmentsBox(departments, employee.departmentId)}
                    </TableCell>
                    
                    <TableCell>
                      <TextField
                        id='seniority'
                        placeholder='Seniority'
                        defaultValue={employee.seniority}
                        onChange={e => setSeniority(e.target.value)}
                        sx={{ width: '126%', marginLeft: '-20px', bgcolor: 'white' }}
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                     <TextField
                        id='salary'
                        placeholder='Salary'
                        defaultValue={employee.salary}
                        onChange={e => {
                          if (e.target.value.match(/[\D]/)) {
                            e.target.value = e.target.value.replace(/\D/g, '')
                          } else {
                            setSalary(e.target.value)}
                          }
                        }
                        sx={{ width: '112%', bgcolor: 'white' }}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs} size='small'>
                        <DatePicker
                          id='startingdate'
                          placeholder='Starting Date'
                          onChange={(newStartingDate) => setStartingDate(newStartingDate)}
                          sx={{ bgcolor: 'white' }}
                          slotProps={{ textField: { size: 'small' }}}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                    <SaveSharp
                      sx={{ color: 'rgb(80, 141, 34)' }}
                      fontSize='large'
                      onClick={() => updateEmployeeToDatabase(employee.employeeId, employees[key])}
                    />
                    </TableCell>
                    <CancelSharp
                      sx={{ color: 'rgb(134, 133, 114)', marginTop: '6px' }}
                      fontSize='large'
                      onClick={() => setUpdateOnOff(false)}
                    />
                    </TableRow>
                  :
                  <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component='th' scope='row'>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                  <TableCell>{employee.seniority}</TableCell>
                  <TableCell>{Math.trunc(employee.salary)} €</TableCell>
                  <TableCell>{moment(employee.startingDate).format('MM-DD-YYYY')}</TableCell>
                  <TableCell>
                    <EditSharp
                      sx={{ color: 'rgb(181, 150, 65)' }}
                      fontSize='large'
                      onClick={() => updateEmployeeOnOff(employee.employeeId)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteSharp
                      sx={{ color: 'rgb(226, 108, 34)' }}
                      fontSize='large'
                      onClick={() => deleteEmployee(employee.employeeId)}
                    />
                  </TableCell>
                </TableRow> 
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}