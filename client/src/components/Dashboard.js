import React from "react"; //usestate/useeffect samaan
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { TextField } from "@mui/material";
import { Button } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import '../App.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

import Departments from "./Departments";
import Employees from "./Employees";


//muuta functiot consteiksi
export default function Dashboard() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobtitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [seniority, setSeniority] = useState('');
  const [salary, setSalary] = useState('');
  const [startingDate, setStartingDate] = useState('');

  const [departmentName, setDepartmentName] = useState('');
  const [departmentField, setDepartmentField] = useState('');

  const [data, setData] = useState(''); //muuta allEmployeeksi
  const [employees, setEmployees] = useState({}); //muuta employeessiksi
  const [departments, setDepartments] = useState({});

  const [updateEmployees, setUpdateEmployees] = useState(0);
  const [updateDepartments, setUpdateDepartments] = useState(0);

  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  //console.log("Authenticate.js:sä asetettu localstorage (userId) on: " + userId);

  if (localStorage.getItem('token') === '') {
    navigate('/');
  } else {
    //console.log('loggaus onnistu');
  }

  //Get employees and departments
  useEffect(() => {
      Axios.get('http://localhost:3001/getemployees', { params: { userId: userId} }).then((response) => {
      setEmployees(response.data);
    })
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      //console.log('useEffect departments-data on : ' + response.data);
      setDepartments(response.data);
    })
  }, [])

  //Update employees table
  useEffect(() => {
    Axios.get('http://localhost:3001/getemployees', { params: {userId: userId } }).then((response) => {
      setEmployees(response.data);
    })
  }, [updateEmployees, userId]) // tarvitseeko userId? jos tarvitsee, muuta muutkin useEffectit

  //Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartments])

  function addEmployeeToDatabase() {
    let jap = [];
    Object.entries(departments).map(([key, department]) => (
      jap.push(department.name.toString())
    ))

    let id = (parseInt(jap.indexOf(departmentId)) + 1);
    console.log("departmentin ID on: " + (parseInt(jap.indexOf(departmentId)) + 1));

    Axios.post('http://localhost:3001/addemployee', {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      departmentId: id,
      seniority: seniority,
      salary: salary,
      startingDate: dayjs(startingDate).format('YYYY/MM/DD')
    })
    if (updateEmployees === 0) { // tee funktioksi
      setUpdateEmployees(1);
    } else {
      setUpdateEmployees(0);
    }
  }

  const addDepartmentToDatabase = () => {
    console.log('(addDepartmentToDatabase) userId on: ' + userId + ' name on: ' + departmentName + ' field on: ' + departmentField);
    Axios.post('http://localhost:3001/adddepartment', {
      userId: userId,
      name: departmentName,
      field: departmentField
    })
    if (updateDepartments === 0) { // tee funktioksi
      setUpdateDepartments(1);
    } else {
      setUpdateDepartments(0);
    }
  }

  function deleteData(id) {
    Axios.post('http://localhost:3001/deletedata', {
      user: userId,
      id: id
    })
    if (updateEmployees === 0) { // tee funktioksi
      setUpdateEmployees(1);
    } else {
      setUpdateEmployees(0);
    }
  }

  const updateData = (id) => {
    Axios.put('http://localhost:3001/updatedata', {
      data: data,
      id: id
    })
  }

  const logout = () => {
    localStorage.setItem('token', '');
    //console.log('Dashboardissa asetettu localStorage on: ' + localStorage.getItem('token'));
    navigate('/');
  }

  function DepartmentsBox(departmentsProps) {
    // VIIMEISTELE
    const jep = [];
    Object.entries(departmentsProps).map(([key, department]) => (
      jep.push(department.name.toString())
    ))
    return (
        <Autocomplete
          options={jep}
          value={departmentId}
          renderInput={(params) => <TextField {...params} label='Department' />}
          onChange={(event, newValue) => {setDepartmentId(newValue);}}
          size='small'
          style={{minWidth: 150}}
        />
    )
  }

  const addEmployee = () => {
    return (
      <div className="addemployee">
        <TextField
          id='firstname'
          placeholder='First Name'
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          size='small'
        />
        <TextField
          id='lastname'
          placeholder='Last Name'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          size='small'
        />
        <TextField
          id='jobtitle'
          placeholder='Job Title'
          value={jobTitle}
          onChange={e => setJobtitle(e.target.value)}
          size='small'
        />

        {DepartmentsBox(departments)}

        <TextField
          id='seniority'
          placeholder='Seniority'
          value={seniority}
          onChange={e => setSeniority(e.target.value)}
          size='small'
        />
        <TextField
          id='salary'
          placeholder='Salary'
          value={salary}
          onChange={e => setSalary(e.target.value)}
          size='small'
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} size='small'>
          <DatePicker // TODO: maxDate
            id='startingdate'
            placeholder='Starting Date'
            value={null} // <- tarvitseeko tätä?
            onChange={(newStartingDate) => setStartingDate(newStartingDate)}
            slotProps={{ textField: { size: 'small' }}}
          />
        </LocalizationProvider>

        <Button
          variant='contained'
          color='success'
          onClick={() => addEmployeeToDatabase()}
        >
          ADD EMPLOYEE
        </Button>
      </div>
    )
  }

  const addDepartment = () => {
    return (
      <div>
        <TextField
          id='departmentname'
          placeholder='Name'
          value={departmentName}
          onChange={e => setDepartmentName(e.target.value)}
          size='small'
        />
        <TextField
          id='departmentfield'
          placeholder='Field'
          value={departmentField}
          onChange={e => setDepartmentField(e.target.value)}
          size='small'
        />
        <Button
          variant='contained'
          color='success'
          onClick={() => addDepartmentToDatabase()}
        >
        ADD DEPARTMENT
        </Button>
      </div>
    )
  }

  // TODO: työntekijöiden ja osastojen lisäys omiksi funktioiksi
  return (
    <div>
      <div className="logout">
        <button onClick={() => logout()}>LOGOUT</button><br />
        <div>
          <Employees employeesProps={employees} userIdProps={userId} />
          </div>
          <div>
            <Departments departmentsProps={departments} />
          </div>
          {addEmployee()}
          {addDepartment()}
      </div>
    </div>
  );
}

/*


<button onClick={console.log('FIRSTNAME ON: ' + firstName)}>consolelogia</button>



<TextField
              id='startingdate'
              placeholder='Starting Date'
              value={startingDate}
              onChange={e => setStartingDate(e.target.value)}
            />

*/