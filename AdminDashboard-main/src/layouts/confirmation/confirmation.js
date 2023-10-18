import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { closeCon } from 'features/confirmationModal/confirmationModal';
import { setRequest } from 'features/confirmationModal/confirmationModal';

export default function AlertDialog() {

  const dispatch = useDispatch()
  const {open,title,message,request} = useSelector(state => state.confirmationModal)



  return (
    <div>
      <Dialog
        open={open}
        onClose={()=>{ 
          dispatch(closeCon())
          dispatch(setRequest({state:false,action:""}))
         }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ 
            dispatch(closeCon()) 
            dispatch(setRequest({state:false,action:""}))
          }}>Cancel</Button>
          <Button onClick={()=>{ 
            dispatch(closeCon())
            dispatch(setRequest({state:true,action:request.action}))
             }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
