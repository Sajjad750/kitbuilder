import axios from 'axios';
import { closeLoader } from 'features/Loader/loaderSlice';
import { openLoader } from 'features/Loader/loaderSlice';
import { sendFileData, clearSendFileDataMessage, clearSendFileDataError } from 'features/filesData/filesSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FileUploader = () => {
    const dispatch = useDispatch()
    const {isAuthenticated} = useSelector((state) => state.admin);
    const {sendFileDataState} = useSelector((state) => state.files);

    function bytesToMB(bytes) {
      return (bytes / (1000 * 1000)).toFixed(2);
    }
  const handleUpload = async(event) => {

    try{
        dispatch(openLoader())
        if(event.target.files[0] && event.target.files[0].type.startsWith("image/")){
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            formData.append('upload_preset', 'vcmakbux');
            formData.append('folder', 'userUploads');
        // do something with the file, like upload to server or cloudinary API
        const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
        const requestData = {
            filename:file.name,
            size:bytesToMB(file.size),
            preview:res.data.secure_url,
            dimensions:"0x0"
        }
        dispatch(sendFileData({isAuthenticated,requestData}))
        }

    }catch(error){
      dispatch(closeLoader())
        console.log(error)
    }

  };

  useEffect(() => {
    if (sendFileDataState.message) {
      alert("Success: " + sendFileDataState.message);
      dispatch(clearSendFileDataMessage());
    }
  }, [sendFileDataState.message, dispatch]);

  useEffect(() => {
    if (sendFileDataState.error) {
      alert("Error: " + sendFileDataState.error);
      dispatch(clearSendFileDataError());
    }
  }, [sendFileDataState.error, dispatch]);

  return (
    <div>
      <button
        onClick={() => document.getElementById('file-upload').click()}
        className="upload-button"
        style={{
          backgroundColor: '#FD9A13',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '10px 20px',
          border: 'none',
          fontSize: '18px',
          cursor:"pointer"
        }}
      >
        Upload File
      </button>
      <input
        type="file"
        id="file-upload"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUploader;
