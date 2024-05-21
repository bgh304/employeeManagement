import React from "react"; //usestate/useeffect samaan
import { useState, useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { TextField } from "@mui/material";
import { Button } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import '../App.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

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
  const [employees, setEmployees] = useState({});
  const [departments, setDepartments] = useState({});
  const [departmentsEmployeesAmount, setDepartmentsEmployeesAmount] = useState({});

  const [updateEmployees, setUpdateEmployees] = useState(0);
  const [updateDepartments, setUpdateDepartments] = useState(0);

  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  if (localStorage.getItem('token') === '') {
    navigate('/');
  } else {
    //console.log('loggaus onnistu');
  }

  // Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartments, userId]) // tarvitseeko userId? jos tarvitsee, muuta muutkin useEffectit

  // Get departments' employees amount

  function addEmployeeToDatabase() {
    // VIIMEISTELE
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
          onChange={(event, newValue) => {setDepartmentId(newValue);}} // tarvitseeko 'eventtiä'?
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

  // TODO: työntekijöiden ja osastojen lisäys omiksi funktioiksi
  return (
    <div>
      <div className="logout">
        <button onClick={() => logout()}>LOGOUT</button><br />
      </div>
      <div>
        <Employees userIdProps={userId} updateEmployeesProps={updateEmployees} />
      </div>
      <div>
      </div>
      {addEmployee()}
    </div>
  );
}

/*




*/