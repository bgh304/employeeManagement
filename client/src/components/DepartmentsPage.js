import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import SettingsSharp from '@mui/icons-material/SettingsSharp';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Axios from 'axios';
import '../App.css';

import Departments from './Departments';

export default function DepartmentsPage() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  const [departmentName, setDepartmentName] = useState('');
  const [departmentField, setDepartmentField] = useState('');
  const [departments, setDepartments] = useState({});

  const [updateDepartments, setUpdateDepartments] = useState(false);

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

  //Get departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [])

  //Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartments, userId])

  const addDepartmentToDatabase = () => {
    Axios.post('http://localhost:3001/adddepartment', {
      userId: userId,
      name: departmentName,
      field: departmentField
    })

    if (!updateDepartments) {
      setUpdateDepartments(true);
    } else {
      setUpdateDepartments(false);
    }
    
    setDepartmentName('');
    setDepartmentField('');
  }

  const addDepartment = () => {
    return (
      <div className='adddepartment'>
        <TextField
          id='departmentname'
          placeholder='Name'
          value={departmentName}
          onChange={e => setDepartmentName(e.target.value)}
          size='small'
          sx={{ width: '50%', bgcolor: 'white' }}
          inputProps={{ maxLength: 30 }}
        />
        <TextField
          id='departmentfield'
          placeholder='Field'
          value={departmentField}
          onChange={e => setDepartmentField(e.target.value)}
          size='small'
          sx={{ width: '50%', bgcolor: 'white' }}
          inputProps={{ maxLength: 30 }}
        />
        <ThemeProvider theme={theme}>
          <Button
            variant='contained'
            color='beige'
            sx={{ color: 'rgb(243, 240, 230)', width: '15%'}}
            onClick={() => addDepartmentToDatabase()}
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
        <SettingsSharp
          sx={{ color: 'rgb(124, 101, 38)', paddingRight: 2 }}
          fontSize='medium'
          onClick={() => settings()}
        />
        <ExitToAppSharpIcon
          sx={{ color: 'rgb(124, 101, 38)' }}
          fontSize='medium'
          onClick={() => logout()}
        />
      </div>
      <div style={{ marginTop: '43px' }}>
        <Departments userIdProps={userId} updateDepartmentsProps={updateDepartments} />
      </div>
      {addDepartment()}
      <NotificationContainer />
    </div>
  )
}