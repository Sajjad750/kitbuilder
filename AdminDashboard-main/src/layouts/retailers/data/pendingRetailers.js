
// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotActivatedRetailers } from "features/retailersData/retailersSlice";
import { useEffect, useState } from "react";
// Images
import team2 from "assets/images/team-2.jpg";
import { updateRetailerStatus } from "features/retailersData/retailersSlice";
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { setcurrentRetailer } from "features/retailersData/retailersSlice";
import { useNavigate } from "react-router-dom";
import { deleteRetailer } from "features/retailersData/retailersSlice";

export default function data() {

  const notActivatedRetailers = useSelector((state) => state.retailers.notActivatedRetailers);
  const request = useSelector(state => state.confirmationModal.request)
  const isLoading = useSelector((state) => state.retailers.isLoading);
  const error = useSelector((state) => state.retailers.error);
  const [id,setId] = useState("")
  const [deletionId, setDeletionId] = useState("");
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.admin)
  const navigate = useNavigate()

  // useEffect(() => {
  //   dispatch(fetchNotActivatedRetailers());
  // }, [dispatch]);

  const handleStatusChange = (retailerId) => {
    setId(retailerId)
    dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to approve this Retailer?",request:{state:false,action:"updateretailer"}}))    
  };

  useEffect(()=>{
    if(request.state && request.action === "updateretailer"){
      dispatch(updateRetailerStatus({id,isAuthenticated}));
      dispatch(setRequest({state:false,action:""}));
      setId("")
    }
  },[request])

  useEffect(()=>{
    if(request.state && request.action === "deleteretailer"){
      dispatch(deleteRetailer({deletionId,isAuthenticated}));
      dispatch(setRequest({state:false,action:""}));
      setDeletionId("")
    }
  },[request])

  const handleRetailerDelete = (retailerId) => {
    setDeletionId(retailerId)
    dispatch(openCon({title:"Deletion Confirmation!",message:"Are you sure you want to delete this retailer?",request:{state:false,action:"deleteretailer"}}))    
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rowsData =Array.isArray(notActivatedRetailers) && notActivatedRetailers.length > 0  ? notActivatedRetailers.map(data => ({
    author: <Author image={team2} name={data.name} email={data.email} />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={data.status ? "Active" : "Pending"} color={data.status ? "success" : "dark"} variant="gradient" size="sm" />
      </MDBox>
    ),
    applied: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.createdAt}
      </MDTypography>
    ),
    view: (
      <MDTypography onClick={()=>{
        dispatch(setcurrentRetailer(data))
        navigate("/retailerdetails")
      }} variant="caption" color="text" sx={{cursor:"pointer"}} fontWeight="medium">
        View Details
      </MDTypography>
    )      
    ,  
    action: (
      <MDTypography onClick={()=>{handleStatusChange(data._id)}} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        Approve Retailer
      </MDTypography>
    ),
    delete: (
      <MDTypography onClick={()=>{handleRetailerDelete(data._id)}} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
      <DeleteIcon  sx={{cursor:"pointer",'&:hover': {
        color: "red",
     }}} /> 
      </MDTypography>
    )
  })):[];

return {
  columns: [
    { Header: "author", accessor: "author", width: "45%", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    { Header: "view", accessor: "view", align: "left" },
    { Header: "applied", accessor: "applied", align: "left" },
    { Header: "action", accessor: "action", align: "left" },
    { Header: "delete", accessor: "delete", align: "left" },
  ],
  rows: rowsData
};
  
}
