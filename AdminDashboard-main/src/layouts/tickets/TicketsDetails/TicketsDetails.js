import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import './TicketsDetails.css'
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentTicket } from 'features/ticketsData/ticketsSlice'; // adjust this import to match your store
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const TicketsDetails = () => {
  const navigate = useNavigate()
  const { currentTicket } = useSelector((state) => state.tickets); // adjust this selector to match your store
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setcurrentTicket({})); // Dispatch an action to reset ticket
    }
  }, [currentTicket, dispatch])

  const renderValue = (field, value) => {
    if (field === 'attachments' && Array.isArray(value) && value.length > 0) {
      return (
        <div className="attachment-preview">
          {value.map((attachment, index) => (
            <img key={index} src={attachment.file} alt={`Attachment ${index + 1}`} />
          ))}
        </div>
      );
    } else if (field === 'attachments' && (!Array.isArray(value) || value.length === 0)) {
      return <div>No attachments were attached by the client.</div>;
    } else {
      return value;
    }
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <button onClick={() => {
        navigate('/tickets')
      }} id="backButton">Go Back</button>
      {currentTicket && Object.keys(currentTicket).length > 0 ? (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableBody>
              {Object.entries(currentTicket).map(([field, value]) => (
                field !== '_id' && field !== '__v' && (
                  <TableRow key={field}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'DodgerBlue' }}>
                      {field}
                    </TableCell>
                    <TableCell>{renderValue(field, value)}</TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No data available</div>
      )}
    </DashboardLayout>
  );
};

export default TicketsDetails;
