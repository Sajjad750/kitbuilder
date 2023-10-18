import React from 'react'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { closeModal } from '../../redux/Modal/modalSlice';
import { useDispatch, useSelector } from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
    const dispatch = useDispatch()
    const { isOpen, message, variant } = useSelector((state) => state.modal)
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeModal())
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={isOpen} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
