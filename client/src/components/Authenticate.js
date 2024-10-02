import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from "@mui/material";
import { Button } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import '../App.css';

import MyImage from '../logo.jpeg';

export default function Authenticate() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState ('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState ('');

  const [loginSuccess, setLoginSuccess] = useState('');
  const [regirstrationSuccess, setRegistrationSuccess] = useState('');

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      beige: {
        main: 'rgb(170, 136, 42)',
        dark: 'rgb(121, 96, 29)',
      },
    },
  });

  Axios.defaults.withCredentials = true;

  const register = () => {
    if (usernameReg !== '' && passwordReg !== '') {
      Axios.post("http://localhost:3001/register", {
        username: usernameReg,
        password: passwordReg
      });
      setRegistrationSuccess('');
    } else {
      setRegistrationSuccess('Please set both username and password.')
    }
  };

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      username: username,
      password: password,
    }).then((response) => {
      if (!response.data.auth) {
        setLoginSuccess('Login failed.')
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user);
        localStorage.setItem('userid', response.data.userid);
        setLoginSuccess('');
        navigate('/employeespage', {state: {token: localStorage.getItem('token'), auth: true}});
      }
    })
  };

  const loginKeyboard = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  }

  return (
    <div className='App' style={{
      minHeight: '42.9em',
      marginRight: '-1px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      <div className='logo'>
        <img src={MyImage} alt='logo'/>
      </div>
      <div className='registrationlogin'>
        <div className="registration">
          <h3>Registration</h3>
          <TextField
            id='usernamereg'
            placeholder='Username'
            onChange={e => setUsernameReg(e.target.value)}
            size='small'
            inputProps={{ maxLength: 30 }}
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            id='passwordreg'
            placeholder='Password'
            type='password'
            onChange={e => setPasswordReg(e.target.value)}
            size='small'
            sx={{ backgroundColor: 'white' }}
          />
          <p style={{fontFamily: 'verdana', color: 'red', margin: '4px'}}>
            {regirstrationSuccess}
          </p>
          <ThemeProvider theme={theme}>
            <Button
              variant='contained'
              color='beige'
              sx={{ color: 'rgb(243, 240, 230)' }}
              onClick={() => register()}
            >
              REGISTER
            </Button>
          </ThemeProvider>
        </div>
        <div className="login">
          <h3>Login</h3>
          <TextField
            id='username'
            placeholder='Username...'
            onChange={e => setUsername(e.target.value)}
            size='small'
            inputProps={{ maxLength: 30 }}
            sx={{ backgroundColor: 'white' }}
          />
          <TextField
            id='password'
            placeholder='Password...'
            type='password'
            onChange={e => setPassword(e.target.value)}
            size='small'
            sx={{ backgroundColor: 'white' }}
            onKeyDown={loginKeyboard}
          />
          <p style={{fontFamily: 'verdana', color: 'red', margin: '4px'}}>
            {loginSuccess}
          </p>
          <ThemeProvider theme={theme}>
            <Button
              variant='contained'
              color='beige'
              sx={{ color: 'rgb(243, 240, 230)' }}
              onClick={() => login()}
            >
              LOGIN
            </Button>
          </ThemeProvider> 
        </div>
      </div>
    </div>
  );
}