import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Axios from 'axios';
import '../App.css';

import SettingsSharp from '@mui/icons-material/SettingsSharp';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';

import Employees from './Employees';

export default function EmployeesPage() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobtitle] = useState('');
  const [departmentId, setDepartmentId] = useState(null);
  const [seniority, setSeniority] = useState('');
  const [salary, setSalary] = useState('');
  const [startingDate, setStartingDate] = useState('');

  const [departments, setDepartments] = useState({}); // Departments data for DepartmentsBox function

  const [updateEmployees, setUpdateEmployees] = useState(false); // Changed to re-render Employee component's employees table

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      beige: {
        main: 'rgb(144, 119, 53)',
        dark: 'rgb(98, 77, 19)',
      },
    },
  });

  if (localStorage.getItem('token') === '') {
    navigate('/');
  }

  // Get Departments (for DepartmentsBox function)
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [])

  const addEmployeeToDatabase = () => {
    Axios.post('http://localhost:3001/addemployee', {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      departmentId: departmentId,
      seniority: seniority,
      salary: salary,
      startingDate: dayjs(startingDate).format('YYYY/MM/DD')
    })

    if (!updateEmployees) {
      setUpdateEmployees(true);
    } else {
      setUpdateEmployees(false);
    }
    
    setFirstName('');
    setLastName('');
    setJobtitle('');
    setDepartmentId('');
    setSeniority('');
    setSalary('');
  }

  // Menu to select departments
  const departmentsBox = (departmentsProps) => {
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
        value={departmentId}
        renderInput={(params) => <TextField {...params} label='Department' />}
        onChange={(event, newValue) => {
          setDepartmentId(parseInt(departmentIds[departmentNames.indexOf(newValue)]));
        }}
        size='small'
        sx={{ minWidth: 150, bgcolor: 'white' }}
      />
    )
  }

  const addEmployee = () => {
    return (
      <div className='addemployee'>
        <TextField
          id='firstname'
          placeholder='First Name'
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          size='small'
          sx={{ bgcolor: 'white' }}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          id='lastname'
          placeholder='Last Name'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          size='small'
          sx={{ bgcolor: 'white' }}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          id='jobtitle'
          placeholder='Job Title'
          value={jobTitle}
          onChange={e => setJobtitle(e.target.value)}
          size='small'
          sx={{ bgcolor: 'white' }}
          inputProps={{ maxLength: 20 }}
        />

        {departmentsBox(departments)}

        <TextField
          id='seniority'
          placeholder='Seniority'
          value={seniority}
          onChange={e => setSeniority(e.target.value)}
          size='small'
          sx={{ bgcolor: 'white' }}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          id='salary'
          placeholder='Salary'
          value={salary}
          onChange={e => {
            if (e.target.value.match(/[\D]/)) {
              e.target.value = e.target.value.replace(/\D/g, '')
            } else {
              setSalary(e.target.value)}
            }
          }
          sx={{ bgcolor: 'white' }}
          size='small'
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} size='small'>
          <DatePicker
            id='startingdate'
            placeholder='Starting Date'
            onChange={(newStartingDate) => setStartingDate(newStartingDate)}
            sx={{ bgcolor: 'white' }}
            slotProps={{ textField: { size: 'small' }}}
          />
        </LocalizationProvider>
        <ThemeProvider theme={theme}>
          <Button
            variant='contained'
            color='beige'
            sx={{ color: 'rgb(243, 240, 230)', width: '9%' }}
            onClick={() => addEmployeeToDatabase()}
          >
            ADD
          </Button>
        </ThemeProvider>
      </div>
    )
  }

  const logout = () => {
    localStorage.setItem('token', '');
    navigate('/');
  }

  const settings = () => {
    navigate('/settings');
  }

  return (
    <div>
      <div className="logoutsettings">
        <div>
          <SettingsSharp
            sx={{ color: 'rgb(124, 101, 38)', marginTop: '2px' }}
            fontSize='medium'
            onClick={() => settings()}
          />
        </div>
        <div>
          <ExitToAppSharpIcon
            sx={{ color: 'rgb(124, 101, 38)', marginTop: '2px'}}
            fontSize='medium'
            onClick={() => logout()}
          />
        </div>
      </div>
      <div style={{ marginTop: '43px' }}>
        {/*'updateEmployees' is sent to Employees component to re-render employees table.*/}
        <Employees userIdProps={userId} updateEmployeesProps={updateEmployees} />
      </div>
      <div>
      </div>
      {addEmployee()}
    </div>
  );
}