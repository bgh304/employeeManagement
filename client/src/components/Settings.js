import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Button } from "@mui/material"
import Axios from 'axios';
import '../App.css';

// TODO: kokeile importtaa kaikki kerrallaan
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Settings() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  
  const [open, setOpen] = useState(false); // muuta nimi?

  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  const deleteAccount = () => {
    console.log('DeleteAccount userId on: ' + userId);
    Axios.post('http://localhost:3001/deleteallemployees', {
      userid: userId
    })

    Axios.post('http://localhost:3001/deletealldepartments', {
      userid: userId
    })

    Axios.post('http://localhost:3001/deleteaccount', {
      userid: userId
    }).then(
      navigate('/')
    )
  }

  const goBack = () => {
    navigate(-1);
  }

  // laita handleClickOpen ja handleClickClose samaan funktioon
  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClickClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>DELETE ACCOUNT</Button><br />
      <Dialog
        open={open}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id='alert-dialog-title'>
          {"You are about to delete this account!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' color='red'>
            Are you sure you want to delete this account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Don't delete</Button>
          <Button onClick={deleteAccount} autoFocus sx={{ color: 'red' }}>DELETE</Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => goBack()}>Go Back</Button>
    </div>
  )
}