import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Axios from 'axios';
import '../App.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Settings() {
  const [userId, setUserId] = useState(localStorage.getItem('userid'));
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  const deleteAccount = () => {
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

  const handleClick = (action) => {
    if (action === 'open') {
      setDialogOpen(true);
    }
    if (action === 'close') {
      setDialogOpen(false);
    }
  }

  return (
    <div style={{ height: '39.5em' }}>
      <Button
        onClick={() => goBack()}
        sx={{ color: 'rgb(124, 101, 38)' }}
      >
        Go Back
      </Button><br />
      <Button
        onClick={() => handleClick('open')}
        sx={{ color: 'red' }}
      >
        DELETE ACCOUNT
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => handleClick('close')}
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
          <Button onClick={() => handleClick('close')}>Don't delete</Button>
          <Button onClick={deleteAccount} autoFocus sx={{ color: 'red' }}>DELETE</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}