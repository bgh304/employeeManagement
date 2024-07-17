import React, {useState, useEffect } from "react"; //usestate/useeffect samaan
import { BrowserRouter, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { TextField } from "@mui/material";
import { Button } from "@mui/material"
import SettingsSharp from '@mui/icons-material/SettingsSharp';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import '../App.css';

import Departments from "./Departments";

import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function DepartmentsPage() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  const [departmentName, setDepartmentName] = useState('');
  const [departmentField, setDepartmentField] = useState('');
  const [departments, setDepartments] = useState({});

  const [updateDepartments, setUpdateDepartments] = useState(false);

  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  if (localStorage.getItem('token') === '') {
    navigate('/');
  } else {
    //console.log('loggaus onnistu');
  }

  //Get departments
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      //console.log('useEffect departments-data on : ' + response.data);
      setDepartments(response.data);
    })
  }, [])

  //Update departments table
  useEffect(() => {
    Axios.get('http://localhost:3001/getdepartments', { params: { userId: userId } }).then((response) => {
      setDepartments(response.data);
    })
  }, [updateDepartments, userId]) // tarvitseeko userId?

  const addDepartmentToDatabase = () => {
    console.log('(addDepartmentToDatabase) userId on: ' + userId + ' name on: ' + departmentName + ' field on: ' + departmentField);

    if (departments.find(department => department.name === departmentName) === undefined) {
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

    } else {
      NotificationManager.error('Department name is already in use!');
      console.log('NIMI ON JO KÄYTÖSSÄ!');
    }
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
          inputProps={{ maxLength: 30 }}
        />
        <TextField
          id='departmentfield'
          placeholder='Field'
          value={departmentField}
          onChange={e => setDepartmentField(e.target.value)}
          size='small'
          inputProps={{ maxLength: 30 }}
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

  const logout = () => {
    localStorage.setItem('token', '');
    //console.log('Dashboardissa asetettu localStorage on: ' + localStorage.getItem('token'));
    navigate('/');
  }

  const settings = () => {
    navigate('/settings');
  }

  return (
    <div>
      <div className="logoutsettings">
        <SettingsSharp
          color='primary'
          fontSize='medium'
          sx={{ paddingRight: 2 }}
          onClick={() => settings()}
        />
        <ExitToAppSharpIcon
          color='secondary'
          fontSize='medium'
          onClick={() => logout()}
        />
        {/*<button onClick={() => Settings()}>SETTINGS</button>
        <button onClick={() => logout()}>LOGOUT</button><br />*/}
      </div>
      <div>
        <Departments userIdProps={userId} updateDepartmentsProps={updateDepartments} />
      </div>
      {addDepartment()}
      <NotificationContainer />
    </div>
  )
}