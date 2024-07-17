import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { TextField } from "@mui/material";
import { Button } from "@mui/material"
import '../App.css';

export default function Authenticate() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState ("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState ("");
  
    const [loginSuccess, setLoginSuccess] = useState('');
    const [regirstrationSuccess, setRegistrationSuccess] = useState('');
    const [loginStatus, setLoginStatus] = useState(false); //tarviiko enään?
    const [token, setToken] = useState(''); //tarviiko enään?

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const register = () => {
      console.log('register() username on: ' + usernameReg);
      if (usernameReg !== '' && passwordReg !== '') {
        Axios.post("http://localhost:3001/register", {
          username: usernameReg,
          password: passwordReg
        }).then((response) => {
          console.log(response);
        });
        setRegistrationSuccess('');
      } else {
        setRegistrationSuccess('Please set both username and password.')
      }
    };
  
    const login = () => {
      console.log("login?");
      Axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      }).then((response) => {
        if (!response.data.auth) {
          setLoginStatus(false);
          console.log('login failed');
          setLoginSuccess('Login failed.')
        } else {
          console.log(response.data);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('user', response.data.user);
          localStorage.setItem('userid', response.data.userid);
          setLoginStatus(true);
          setLoginSuccess('');
          navigate('/employeespage', {state: {token: localStorage.getItem("token"), auth: true}}); //tarviiko propseja?
        }
      })
    };

    const loginKeyboard = (event) => {
      if (event.key === 'Enter') {
        login();
      }
    }

    const userAuthenticeted = () => { // tarvitseeko enään?
      Axios.get("http://localhost:3001/isUserAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((response) => {
        console.log(response);
      });
    };

    return (
      <div className="App">
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
          <Button
            variant='contained'
            color='action'
            onClick={() => register()}
          >
            REGISTER
          </Button>
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
        </div>
        <Button
          variant='contained'
          color='success'
          onClick={() => login()}
        >
          LOGIN
        </Button>
      </div>
    );
}

/*



*/