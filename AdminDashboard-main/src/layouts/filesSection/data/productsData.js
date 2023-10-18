
// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
// Images
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProduct } from "features/productsData/productsSlice";
import axios from "axios";
import { deleteFiles, fetchFiles, clearDeleteFilesMessage, clearDeleteFilesError } from "features/filesData/filesSlice";


export default function data() {

  const { isAuthenticated } = useSelector((state) => state.admin);
  const { files, deleteFilesState } = useSelector((state) => state.files);
  const request = useSelector(state => state.confirmationModal.request);
  const dispatch = useDispatch();
  const [id, setId] = useState("");

  useEffect(() => {
    dispatch(fetchFiles(isAuthenticated));
  }, [dispatch]);

  const handleDownloadImage = (objData) => {
    axios.get(objData.preview, { responseType: "blob" })
      .then(response => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(response.data);
        link.download = objData.filename;
        link.click();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteProduct = (fileId) => {
    setId(fileId);
    dispatch(openCon({ title: "Approval Confirmation!", message: "Are you sure you want to Delete this File?", request: { state: false, action: "deletefile" } }));
  };

  useEffect(() => {
    if (request.state && request.action === "deletefile") {
      dispatch(deleteFiles({ id, isAuthenticated }));
      dispatch(setRequest({ state: false, action: "" }));
      setId("");
    }
  }, [request, id, isAuthenticated, dispatch]);

  useEffect(() => {
    if (deleteFilesState.message) {
      alert("Success: " + deleteFilesState.message);
      dispatch(clearDeleteFilesMessage());
    }
  }, [deleteFilesState.message, dispatch]);

  useEffect(() => {
    if (deleteFilesState.error) {
      alert("Error: " + deleteFilesState.error);
      dispatch(clearDeleteFilesError());
    }
  }, [deleteFilesState.error, dispatch]);

  const rowsData =Array.isArray(files) && files.length > 0  ? files.map(data => ({
    name: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.filename}
      </MDTypography>
    ),
    size: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.size}
      </MDTypography>
    ),
    // dimensions: (
    //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //     {data.dimensions}
    //   </MDTypography>
    // ),
    preview: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <img src={data.preview} style={{width:"100px",height:"100px"}} />
      </MDTypography>
    ),
    uploadedAt: (
      <MDTypography component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        {data.uploadedAt}
      </MDTypography>
    ),        
    download: (
      <MDTypography onClick={()=>{ 
        handleDownloadImage(data)
       }} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        Download Product
      </MDTypography>
    ),
    delete: (
      <MDTypography  onClick={()=>{
        handleDeleteProduct(data._id)
      }} component="a" >
        <DeleteIcon  sx={{cursor:"pointer",'&:hover': {
        color: "red",
     }}} /> 
      </MDTypography>
    )
  })):[];

return {
  columns: [
    { Header: "name", accessor: "name", width: "45%", align: "left" },
    { Header: "size", accessor: "size", align: "left" },
    // { Header: "dimensions", accessor: "dimensions", align: "left" },
    { Header: "preview", accessor: "preview", align: "left" },
    { Header: "uploadedAt", accessor: "uploadedAt", align: "left" },
    { Header: "download", accessor: "download", align: "left" },
    { Header: "delete", accessor: "delete", align: "left" },
  ],
  rows: rowsData
};
  
}
