import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { TextField } from '@mui/material';
import { Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import EditSharp from '@mui/icons-material/EditSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import SaveSharp from '@mui/icons-material/SaveSharp';
import CancelSharp from '@mui/icons-material/CancelSharp';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import moment from 'moment';

//kokeile importtaa kaikki kerrallaan
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './../App.css';

export default function Employees({ userIdProps, updateEmployeesProps }) {
  const [departments, setDepartments] = useState({});
  const [employees, setEmployees] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobtitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [seniority, setSeniority] = useState('');
  const [salary, setSalary] = useState(0);
  const [startingDate, setStartingDate] = useState('');

  const [updateEmployeesDelete, setUpdateEmployeesDelete] = useState(false);
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
    if (!updateEmployeesDelete) { // (boolean?)
      setUpdateEmployeesDelete(true);
    } else {
      setUpdateEmployeesDelete(false);
    }
  }

  const UpdateEmployeeToDatabase = (id, employee) => {
    //console.log('UpdateEmployeeToDatabase: ' + lastName);
    // VIIMEISTELE, muuta muuttujanimiä
    let jap = [];
    Object.entries(departments).map(([key, department]) => (
      jap.push(department.name.toString())
    ))
    //console.log('firstName on: ' + firstName);
    // JOS LAITAN KENTTÄÄN TEKSTIÄ, NIIN muuttujat firstName, lastName jne. muuttuvat
    // TODO: kokeile laittaa muuttujat yhteen riviin
    let firstname;
    let lastname;
    let jobtitle;
    //let depId = (parseInt(jap.indexOf(departmentId)) + 1);
    let departmentid;
    let employeeseniority;
    let employeesalary;
    let startingdate;

    // EMPLOYEE.LASTNAME JNE. ON VANHAA DATAA

    // TODO: selvitä voiko else-haaran tehdä tyhjäksi
    firstName === '' ? firstname = employee.firstName : firstname = firstName;
    lastName === '' ? lastname = employee.lastName : lastname = lastName;
    jobTitle === '' ? jobtitle = employee.jobTitle : jobtitle = jobTitle;
    //depId === 0 ? depId = employee.departmentId : depId = depId;
    departmentId === '' ? departmentid = employee.departmentId : departmentid = departmentId;
    seniority === '' ? employeeseniority = employee.seniority : employeeseniority = seniority;
    salary === 0 ? employeesalary = employee.salary : employeesalary = salary;
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
    setDepartmentId(0);
    setSeniority('');
    setSalary(0);
    setStartingDate('');

    setUpdateOnOff(false);
    if (!updateEmployeesDelete) { // (boolean?)
      setUpdateEmployeesDelete(true); // muuta nimi
    } else {
      setUpdateEmployeesDelete(false);
    }
  }

  const updateEmployeeOnOff = (id) => { //nimeä uudelleen
    setUpdateEmployeeId(id);
    if (!updateOnOff) {
      setUpdateOnOff(true);
    } else {
      setUpdateOnOff(false);
    }
  }
  
//console.log('departments[0] on: ' + departments[0].name);
  // VIIMEISTELE
  const kokeilu = (input) => {
    let departmentNames = [];
    let departmentName;
    for (let i = 0; i < Object.keys(departments).length; i++) {
      departmentNames.push(departments[i]);
    }
    //console.log('departmentNames[0] on: ' + departmentNames[0].departmentId);
    //console.log('kokeilu input on: ' + input);
    departmentNames.forEach((element) => {
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

  function DepartmentsBox(departmentsProps, id) {
    // VIIMEISTELE
    const jep = [];
    const departmentIds = [];
    Object.entries(departmentsProps).map(([key, department]) => (
      jep.push(department.name.toString())
    ))
    Object.entries(departmentsProps).map(([key, department]) => (
      departmentIds.push(parseInt(department.departmentId))
    ))
    return (
        <Autocomplete
          options={jep}
          //value={departmentId}
          defaultValue={id}
          renderInput={(params) => <TextField {...params} label='Department' />}
          // newValue on osaston nimi
          onChange={(event, newValue) => {
            setDepartmentId(parseInt(departmentIds[jep.indexOf(newValue)]));
          }} // tarvitseeko 'eventtiä'?
          size='small'
          style={{minWidth: 150}}
        />
    )
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
                    <TableCell>
                      <TextField
                        id='firstname'
                        placeholder='First Name'
                        defaultValue={employee.firstName}
                        onChange={e => setFirstName(e.target.value)}
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
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      {DepartmentsBox(departments, employee.departmentId)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='seniority'
                        placeholder='Seniority'
                        defaultValue={employee.seniority}
                        onChange={e => setSeniority(e.target.value)}
                        size='small'
                        inputProps={{ maxLength: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='salary'
                        placeholder='Salary'
                        defaultValue={employee.salary}
                        onChange={e => setSalary(e.target.value)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs} size='small'>
                        <DatePicker // TODO: maxDate
                          id='startingdate'
                          placeholder='Starting Date'
                          value={null} // <- tarvitseeko tätä?
                          onChange={(newStartingDate) => setStartingDate(newStartingDate)}
                          slotProps={{ textField: { size: 'small' }}}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                    <SaveSharp
                      color='success'
                      fontSize='large'
                      onClick={() => UpdateEmployeeToDatabase(employee.employeeId, employees[key])}
                    />
                      {/*<Button onClick={() =>
                        UpdateEmployeeToDatabase(employee.employeeId, employees[key])}
                        >UPDATE</Button>*/}
                    </TableCell>
                    <CancelSharp
                      color='action'
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
                  <TableCell>{kokeilu(employee.departmentId)}</TableCell>
                  <TableCell>{employee.seniority}</TableCell>
                  <TableCell>{Math.trunc(employee.salary)} €</TableCell>
                  <TableCell>{moment(employee.startingDate).format('MM-DD-YYYY')}</TableCell>
                  <TableCell>
                    <EditSharp
                      color='action'
                      fontSize='large'
                      onClick={() => updateEmployeeOnOff(employee.employeeId)}
                    />
                    {/*<Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>UPDATE</Button>*/}
                  </TableCell>
                  <TableCell>
                    <DeleteSharp
                      color='warning'
                      fontSize='large'
                      onClick={() => deleteEmployee(employee.employeeId)}
                    />
                    {/*<Button onClick={() => deleteEmployee(employee.employeeId)}>DELETE</Button>*/}
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

<Button onClick={() => updateEmployeeOnOff(employee.employeeId)}>UPDATE</Button>


*/