import React from 'react'
import './accordion.css'
import { setfieldvalue, settextUploadTimestamp } from '../../redux/canvasData/canvasData'
import { useDispatch, useSelector } from 'react-redux'
import { Button, InputAdornment, TextField } from '@mui/material'
import MenuList from '../menuList/menuList'

const AddText = () => {
    const dispatch = useDispatch()
    const { fieldvalue } = useSelector((state) => state.canvas)
    return (
        <div>
            <TextField
                value={fieldvalue}
                onChange={(event) => dispatch(setfieldvalue(event.target.value))}
                variant="outlined"
                placeholder="Enter your text here..."
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start"> </InputAdornment>,
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#960909", color: "white", height: "56px", marginRight: "-14px" }}
                                onClick={() => {
                                    dispatch(settextUploadTimestamp(true));
                                }}
                            >
                                Add More
                            </Button>
                        </InputAdornment>
                    ),
                    style: {
                        backgroundColor: 'white',
                        marginTop: "20px"
                    }
                }}
            />

            <MenuList />
        </div >
    )
}

export default AddText