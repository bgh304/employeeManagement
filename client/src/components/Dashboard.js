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
  const [salary, setSalary] = useState(0);
  const [startingDate, setStartingDate] = useState('');

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
  }, [updateEmployees])

  //Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
    })
  }, [updateDepartments])

  function addEmployee() {
    let jap = [];
    {Object.entries(departments).map(([key, department]) => (
      jap.push(department.name.toString())
    ))}

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
    //console.log("data: " + data);
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
          // disablePortal mukaan?
          options={jep}
          value={departmentId}
          renderInput={(params) => <TextField {...params} label='Department' />}
          onChange={(event, newValue) => {setDepartmentId(newValue);}}
          size='small'
          style={{minWidth: 150}}
        />
    )
  }

  // TODO: työntekijän ja osaston listaus omaksi funktioksi
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
                size='small'
              />
            </LocalizationProvider>

            <Button onClick={() => addEmployee()}>ADD EMPLOYEE</Button>
          </div>
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


<div className="addemployee">
            <input type='text'
              placeholder='First Name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <input type='text'
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <input type='text'
              placeholder="Job Title"
              value={jobTitle}
              onChange={e => setJobtitle(e.target.value)}
            />
            <input type='number' //muuta valikoksi
              placeholder="Department"
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
            />
            <input type='text'
              placeholder="Seniority"
              value={seniority}
              onChange={e => setSeniority(e.target.value)}
            />
            <input type='number' //poista nuoliviivat
              placeholder="Salary"
              value={salary}
              onChange={e => setSalary(e.target.value)}
            />
            <input type='date'
              placeholder="Starting Date"
              value={startingDate}
              onChange={e => setStartingDate(e.target.value)}
            />
            <button onClick={() => addEmployee()}>ADD EMPLOYEE</button>
          </div>


*/