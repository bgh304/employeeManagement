import React from "react"; //usestate/useeffect samaan
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import '../App.css';

export default function Authenticate() {
    const [usernameReg, setUernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState ("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState ("");
  
    const [loginStatus, setLoginStatus] = useState(false); //tarviiko enään?
    const [token, setToken] = useState(''); //tarviiko enään?

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const register = () => {
      Axios.post("http://localhost:3001/register", {
        username: usernameReg,
        password: passwordReg,
      }).then((response) => {
        console.log(response);
      });
    };
  
    const login = () => {
      console.log("login?");
      Axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      }).then((response) => {
        if (!response.data.auth) {
          setLoginStatus(false);
        } else {
          console.log(response.data);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('user', response.data.user);
          localStorage.setItem('userid', response.data.userid);
          setLoginStatus(true);
          navigate('/dashboard', {state: {token: localStorage.getItem("token"), auth: true}}); //tarviiko propseja?
        }
      })
    };

    const userAuthenticeted = () => {
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
          <label>Username</label>
          <input 
            type="text" 
            onChange={(e) => {
              setUernameReg(e.target.value);
            }}
          /><br/>
          <label>password</label>
          <input 
            type="text"
            onChange={(e) =>{
              setPasswordReg(e.target.value);
            }} 
          /> <br />
          <button onClick={register}> Register</button>
        </div>
        <div className="login">
          <h3>Login</h3>
          <input 
            type="text" 
            placeholder="Username..." 
            onChange = { (e) => {
              setUsername (e.target.value);
            }}
          /> <br/>
          <input 
            type="password" 
            placeholder="Password..."
            onChange = { (e) => {
              setPassword (e.target.value);
            }}
          />
        </div>
            <button onClick={login}>Login</button>
      </div>
    );
}

/*



*/