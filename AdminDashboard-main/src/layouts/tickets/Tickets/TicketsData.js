import MDTypography from "components/MDTypography";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreIcon from '@mui/icons-material/More';
import EditIcon from '@mui/icons-material/Edit';
import { fetchTickets } from "features/ticketsData/ticketsSlice";
import { deleteTicket } from "features/ticketsData/ticketsSlice";
import { Link, useNavigate } from "react-router-dom";
import { setcurrentTicket } from "features/ticketsData/ticketsSlice";
import { setselectedTicket } from "features/ticketsData/ticketsSlice";
import { openLoader } from 'features/Loader/loaderSlice';
import { closeLoader } from 'features/Loader/loaderSlice';

export default function TicketData() {
  const {isAuthenticated} = useSelector((state) => state.admin);
  const {tickets,error} = useSelector((state) => state.tickets);
  const request = useSelector(state => state.confirmationModal.request)
  const [id, setId] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTickets(isAuthenticated));
  }, [dispatch]);

  // Delete Ticket
  const handleDeleteTicket = (ticketId) => {
    setId(ticketId);
    dispatch(openCon({ title: "Approval Confirmation!", message: "Are you sure you want to Delete this Ticket?", request: { state: false, action: "deleteticket" } }));
  };
  
  // useEffect(() => {
  //   const deleteTicketAsync = async () => {
  //     try {
  //      // Display loader
  //       if (request.state && request.action === "deleteticket") {
  //         await dispatch(deleteTicket({ id, isAuthenticated }));
  //         dispatch(fetchTickets()); // Assuming fetchTickets is used to update the ticket list
  
  //         // Hide loader (if not already hidden)
  //         dispatch(closeLoader());
  
  //         setId("");
  //       }
  //     } catch (error) {
  //       // Handle the error (e.g., display error message)
  //       alert("An error occurred while deleting the ticket. Please try again.");
  
  //       // Hide loader (if not already hidden)
  //       dispatch(closeLoader());
  //     }
  //   };
  
  //   deleteTicketAsync();
  
  //   // Clean up the effect
  //   return () => {
  //     dispatch(setRequest({ state: false, action: "" }));
  //   };
  // }, [request, dispatch, id, isAuthenticated]);
  
  

  useEffect(()=>{
    if(request.state && request.action === "deleteticket"){
      dispatch(deleteTicket({id,isAuthenticated}));
      dispatch(setRequest({state:false,action:""}));
      setId("")
    }
  },[request])
  // useEffect(() => {
  //   const deleteTicketAsync = async () => {
  //     try {
  //       dispatch(openLoader()); // Display loader
  //       if (request.state && request.action === "deleteticket") {
  //         await dispatch(deleteTicket({ id, isAuthenticated }));
  //         dispatch(fetchTickets()); // Assuming fetchTickets is used to update the ticket list
  
  //         // Hide loader (if not already hidden)
  //         dispatch(closeLoader());
  
  //         setId("");
  //       }
  //     } catch (error) {
  //       // Handle the error (e.g., display error message)
  //       alert("An error occurred while deleting the ticket. Please try again.");
  
  //       // Hide loader (if not already hidden)
  //       dispatch(closeLoader());
  //     }
  //   };
  
  //   deleteTicketAsync();
  //   // Clean up the effect
  //   return () => {
  //     dispatch(setRequest({ state: false, action: "" }));
  //   };
  // }, []);
  


  const rowsData =Array.isArray(tickets) && tickets.length > 0  ? tickets.map(data => ({
    // Adjust these fields according to your actual Tickets data structure
    Name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.name}
      </MDTypography>
    ),
    Email: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.email}
      </MDTypography>
    ),
    Company: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.companyName}
      </MDTypography>
    ),
    IssueType: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.issueType}
      </MDTypography>
    ),
    Status: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.status}
      </MDTypography>
    ),
    Update: (
      <MDTypography onClick={()=>{
        dispatch(setselectedTicket(data))
      }} component={Link} to='/ticketupdate'>
      <EditIcon sx={{cursor:"pointer", '&:hover': {color: "red"}}} /> 
    </MDTypography>
    ),
    Details: (
      <MDTypography onClick={()=>{
        dispatch(setcurrentTicket(data))
        navigate("/ticketsdetails")
      }}>
      <MoreIcon sx={{cursor:"pointer", '&:hover': {color: "red"}}} /> 
    </MDTypography>
    ),
    Delete: (
      <MDTypography onClick={() => handleDeleteTicket(data._id)} component="a">
        <DeleteIcon sx={{cursor:"pointer",'&:hover': {color: "red",}}}/> 
      </MDTypography>
    )
  })):[];

  const openTickets = rowsData.filter(row => row.Status.props.children === "open");
  const inProgressTickets = rowsData.filter(row => row.Status.props.children === "in_progress");
  const closedTickets = rowsData.filter(row => row.Status.props.children === "closed");
  
  const columns = [
    { Header: "Name", accessor: "Name", align: "left" },
    { Header: "Email", accessor: "Email", align: "left" },
    { Header: "Company", accessor: "Company", align: "left" },
    { Header: "IssueType", accessor: "IssueType", align: "left" },
    { Header: "Status", accessor: "Status", align: "left" },
    { Header: "Update", accessor: "Update", align: "left" },
    { Header: "Details", accessor: "Details", align: "left" },
    { Header: "Delete", accessor: "Delete", align: "left" },
  ];
  

  return {
    openTickets,
    inProgressTickets,
    closedTickets,
    columns
  };

  
}
