import React, { useState } from 'react';
import { Button, Paper, Typography, Input } from '@mui/material';
import axios from 'axios';
import { config } from '../../config'
import { useSelector } from 'react-redux';


const CsvUploadComponent = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { admin, userRole } = useSelector(state => state.admin);
    let URL = config.url.API_URL;

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        if (!file) {
            alert('Please select a CSV file first.');
            return;
        }

        // Determine the retailerId based on userRole
        const retailerId = userRole === 'admin' ? null : admin._id;

        const formData = new FormData();
        formData.append('csvfile', file);
        formData.append('retailerId', retailerId);  // Add retailerId to the formData

        try {
            setUploading(true);
            const response = await axios.post(`${URL}/api/csv/upload-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully!');
            console.log('Server Response:', response.data);
        } catch (error) {
            alert('Error uploading file:', error.response?.data || error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
            <Typography variant="h6" gutterBottom>
                Upload CSV File
            </Typography>
            <Input
                type="file"
                accept=".csv"
                onChange={onFileChange}
                fullWidth
                style={{ marginBottom: '20px' }}
            />
            <Button
                sx={{ background: "dodgerblue", color: "white" }}
                onClick={onUpload}
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>
        </Paper>
    );
};

export default CsvUploadComponent;
