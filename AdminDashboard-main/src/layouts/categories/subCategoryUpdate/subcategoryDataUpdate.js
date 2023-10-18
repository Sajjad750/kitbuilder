import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { setformModal } from 'features/cartegoriesData/categoriesSlice';
import { setactiveCategoryData } from 'features/cartegoriesData/categoriesSlice';
// import { updateSubCategory } from 'features/cartegoriesData/categoriesSlice';
import { setactiveCategory } from 'features/cartegoriesData/categoriesSlice';

export default function FormDialog() {
  const {formModal,activeCategoryData} = useSelector((state)=> state.categories)
  const {isAuthenticated} = useSelector((state)=> state.admin)
  const [formtext,setformtext] = useState('')
//   const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch()
  function validateString(str, isRequired, minLength, maxLength) {
    // Check if the string is required and is empty
    if (isRequired && str.trim() === '') {
      return false;
    }
    // Check if the string length is less than the minimum length
    if (minLength && str.length < minLength) {
      return false;
    }
    // Check if the string length is greater than the maximum length
    if (maxLength && str.length > maxLength) {
      return false;
    }
    // If all checks pass, return true
    return true;
  }

  const handleClose = () => {
    dispatch(setformModal(false))
    dispatch(setactiveCategoryData({}))
    setformtext("")
  };

  const handleSubmit = async () => {
    // Code for Server Request
    // dispatch(updateSubCategory({catId:activeCategoryData.catId,subCatId:activeCategoryData.subCatId,formtext,isAuthenticated}))
    dispatch(setactiveCategoryData({}))
    dispatch(setformModal(false))
    setformtext("")
    dispatch(setactiveCategory([]))
}

  return (
    <div>
    <Box component="form" sx={{ mt: 3 }}>
      <Dialog open={formModal} onClose={handleClose}>
        <DialogTitle>Update Modal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update your Sub Category please enter updated name here in the input field
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="NAME"
            type="text"
            fullWidth
            variant="standard"
            value={formtext}
            onChange={(e)=> setformtext(e.target.value)} 
          />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=> {
            const result = validateString(formtext,true,3,30)
            if(result){
                handleSubmit()  
            }
          }}>Update</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </div>
  );
}
