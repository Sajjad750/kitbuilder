import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, List, ListItem, ListItemText, ListItemButton, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// ... your other imports

const FileSearchComponent = ({ setFile, allowedFileTypes = ['.svg'] }) => {
    const { files } = useSelector((state) => state.files);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFileSelect = (file) => {
        // Check if the file has an allowed extension
        const fileExtension = `.${file.filename.split('.').pop().toLowerCase()}`;
        if (allowedFileTypes.includes(fileExtension)) {
            setFile(file.preview);
        } else {
            alert(`Please select a ${allowedFileTypes.join(" or ")} file.`);
        }
    };
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const filteredFiles = files?.filter(file =>
        file?.filename?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? "")
    ) ?? [];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'left',
                justifyContent: 'left',
                padding: "30px 0px"
            }}
        >
            <TextField
                label="Search files"
                variant="outlined"
                value={searchTerm}
                sx={{ width: '100%' }}
                onChange={handleSearchChange}
            />
            {searchTerm.length > 0 && (
                <Box>
                    <IconButton onClick={handleClearSearch}>
                        <CloseIcon />
                    </IconButton>
                    <List>
                        {filteredFiles.map((file, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleFileSelect(file)}
                                disablePadding
                            >
                                <ListItemButton
                                    sx={{
                                        backgroundColor: 'lightgrey',
                                        '&:hover': {
                                            backgroundColor: 'dodgerblue',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box
                                                component="div"
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    textAlign:"center",
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                <span>{file.filename}</span>
                                                <img src={file.preview} style={{width:"40px",height:"40px"}} />
                                                <span>{file.size} MB</span>
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default FileSearchComponent;
