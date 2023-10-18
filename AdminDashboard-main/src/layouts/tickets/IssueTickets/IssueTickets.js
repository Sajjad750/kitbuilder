import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Button } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { addTicket } from 'features/ticketsData/ticketsSlice';
import { useDispatch, useSelector } from 'react-redux';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { resetState } from 'features/ticketsData/ticketsSlice';

async function uploadToCloudinary(file) {
    if (file && file.type.startsWith("image/")) {
        // console.log(file,"file")
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vcmakbux');
        formData.append('folder', 'userUploads');
        // do something with the file, like upload to server or cloudinary API
        const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
        console.log(res.data.secure_url)
        return res.data.secure_url
    }
}

export default function IssueTickets() {
    const { handleSubmit, reset, control, register, formState: { errors } } = useForm({
        defaultValues: {
            attachments: [{ file: "" }]
        }
    });
    const { isAuthenticated } = useSelector((state) => state.admin);
    const dispatch = useDispatch()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "attachments"
    });

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        // Reset the state when the component unmounts
        return () => {
          dispatch(resetState())
        };
      }, []);

    const onSubmit = async (data) => {
        // Map over the attachments in the form data
        data.attachments = data.attachments.map((attachment, index) => {
            // Replace each file with its corresponding Cloudinary URL
            return {
                ...attachment,
                file: previews[index],
            }
        });
        const actionResult = await dispatch(addTicket({ data, isAuthenticated }));
    
        if (addTicket.fulfilled.match(actionResult)) {
          reset();
          setPreviews([]);
          alert("Ticket Issued Successfully!")
        } else {
          if (actionResult.payload) {
            // handle error from server
            alert(`Error: ${actionResult.payload}`);
          } else {
            // handle error locally
            alert(`Error: ${actionResult.error.message}`);
          }
        }
    }
    

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        const url = await uploadToCloudinary(file);
        const newPreviews = [...previews];
        newPreviews[index] = url;
        setPreviews(newPreviews);
    };



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box component="form" id="addcategory-form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Title is required", minLength: { value: 5, message: "Min length is 5" } }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="Ticket Title"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "Description is required", minLength: { value: 5, message: "Min length is 5" } }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="Ticket Description"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue="open"
                            render={({ field }) =>
                                <FormControl fullWidth variant="outlined" sx={{ minHeight: '56px' }}>
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label="Status"
                                        error={!!errors.status}
                                        sx={{ minHeight: '44px' }}
                                    >
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="in_progress">In Progress</MenuItem>
                                        <MenuItem value="closed">Closed</MenuItem>
                                    </Select>
                                </FormControl>}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="url"
                            control={control}
                            rules={{
                                required: "URL is required",
                                pattern: {
                                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                                    message: "Invalid URL",
                                }
                            }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="URL"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.url}
                                    helperText={errors.url?.message}
                                />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="issueType"
                            control={control}
                            rules={{ required: "Issue type is required" }}
                            defaultValue=""
                            render={({ field }) =>
                                <FormControl fullWidth variant="outlined" sx={{ minHeight: '56px' }}>
                                    <InputLabel id="issue-type-label">Issue Type</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="issue-type-label"
                                        label="Issue Type"
                                        error={!!errors.issueType}
                                        sx={{ minHeight: '44px' }}
                                    >
                                        <MenuItem value="bug">Bug</MenuItem>
                                        <MenuItem value="feature_request">Feature Request</MenuItem>
                                        <MenuItem value="technical_issue">Technical Issue</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Email is required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Email is not valid" } }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Name is required", minLength: { value: 2, message: "Min length is 2" } }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="companyName"
                            control={control}
                            rules={{ required: "Company name is required", minLength: { value: 2, message: "Min length is 2" } }}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    label="Company Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.companyName}
                                    helperText={errors.companyName?.message}
                                />}
                        />
                    </Grid>

                    {fields.map((item, index) => (
                        <Grid item xs={12} md={6} key={item.id}>
                            <Controller
                                name={`attachments[${index}].file`}
                                control={control}
                                defaultValue={item.file}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        type="file"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.attachments && !!errors.attachments[index]}
                                        helperText={errors.attachments && errors.attachments[index]?.file?.message}
                                        onChange={event => {
                                            field.onChange(event);  // process the file upload in the original form data
                                            handleFileChange(event, index);  // then process the file preview
                                        }}
                                    />}
                            />
                            {previews[index] && <img src={previews[index]} alt="preview" style={{ width: "100px", height: "100px" }} />}
                            <IconButton onClick={() => remove(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button startIcon={<AddIcon />} onClick={() => append({ file: "" })} disabled={fields.length >= 5}>
                            Add attachment
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <button type="submit" style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Issue Ticket</button>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={(e) => {
                            e.preventDefault()
                            reset();
                        }} type="button" style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>

                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
}
