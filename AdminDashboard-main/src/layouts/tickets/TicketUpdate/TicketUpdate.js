import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Button, IconButton, Input, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { updateTicket } from 'features/ticketsData/ticketsSlice'; // You need to create this action
import { useDispatch, useSelector } from 'react-redux';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { setselectedTicket } from 'features/ticketsData/ticketsSlice';
import { useNavigate } from 'react-router-dom';
import { openLoader } from 'features/Loader/loaderSlice';
import { closeLoader } from 'features/Loader/loaderSlice';

async function uploadToCloudinary(file) {
    if (file && file.type.startsWith("image/")) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vcmakbux');
        formData.append('folder', 'userUploads');
        const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
        return res.data.secure_url
    }
}



export default function UpdateTicket() {
    const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
    const navigate = useNavigate()
    const { handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: {
            title: selectedTicket?.title || "",
            description: selectedTicket?.description || "",
            status: selectedTicket?.status || "",
            url: selectedTicket?.url || "",
            issueType: selectedTicket?.issueType || "",
            email: selectedTicket?.email || "",
            name: selectedTicket?.name || "",
            companyName: selectedTicket?.companyName || "",
            attachments: selectedTicket?.attachments ?? [{ file: "" }],
        },
    });
    const { isAuthenticated } = useSelector((state) => state.admin);
    const dispatch = useDispatch()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "attachments"
    });

    const [previews, setPreviews] = useState((selectedTicket?.attachments || []).map((a) => a.file) || []);


    const onSubmit = async (data) => {
        try {
          // Display loader
          dispatch(openLoader());
      
          data.attachments = data.attachments.map((attachment, index) => {
            return {
              ...attachment,
              file: previews[index],
            };
          });
          data.attachments = data.attachments.map(({ file }) => ({ file }));
      
          // Dispatch updateTicket action
          await dispatch(updateTicket({ id: selectedTicket._id, data, isAuthenticated }));
      
          setPreviews([]);
          reset();
      
          // Hide loader (if not already hidden)
          dispatch(closeLoader());
      
          // Show success message
          alert("Ticket Updated Successfully!");
      
          // Navigate to tickets page
          navigate('/tickets');
        } catch (error) {
          // Hide loader (if not already hidden)
          dispatch(closeLoader());
      
          // Handle the error (e.g., display error message)
          alert("An error occurred while updating the ticket. Please try again.");
        }
      };
      


    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        const url = await uploadToCloudinary(file);
        const newPreviews = [...previews];
        newPreviews[index] = url;
        setPreviews(newPreviews);
    };

    // useEffect(() => {
    //     return () => {
    //       dispatch(setselectedTicket({})); // Dispatch an action to reset quote
    //     }
    //   }, [selectedTicket, dispatch])

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <Box component="form" id="updateTicket-form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Title is required", minLength: { value: 5, message: "Min length is 5" } }}
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
                            rules={{ required: "URL is required" }}
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
                    <Grid item xs={12}>
                        <InputLabel>Attachments</InputLabel>
                        {fields.map((item, index) => (
                            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Input
                                    type="file"
                                    onChange={(e) => {
                                        handleFileChange(e, index);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => remove(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {previews[index] && (
                                    <img src={previews[index]} alt="preview" style={{ width: '50px', height: '50px', marginLeft: '10px' }} />
                                )}
                            </Box>
                        ))}
                        <IconButton onClick={() => append({ file: '' })}>
                            <AddIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} mt={3}>
                        {selectedTicket && Object.keys(selectedTicket).length > 0 ? (
                            <button type="submit" style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Update Ticket</button>
                        ) : (
                            <div>No data available</div>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
}
