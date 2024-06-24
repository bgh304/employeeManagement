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

  const DeleteAccount = () => {
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

  const GoBack = () => {
    navigate(-1);
  }

  const HandleClickOpen = () => {
    setOpen(true);
  }

  const HandleClickClose = () => {
    setOpen(false);
  }

  const Action = () => {
    console.log('toiminto');
  }

  return (
    <div>
      <Button onClick={HandleClickOpen}>DELETE ACCOUNT</Button><br />
      <Dialog
        open={open}
        onClose={HandleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id='alert-dialog-title'>
          {"You are about to delete this account!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Do you really want to delete this account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleClickClose}>Don't delete</Button>
          <Button onClick={DeleteAccount} autoFocus>DELETE</Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => GoBack()}>Go Back</Button>
    </div>
  )
}