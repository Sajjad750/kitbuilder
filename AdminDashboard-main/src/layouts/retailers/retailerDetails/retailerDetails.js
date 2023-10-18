import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import './RetailerDetails.css'
import { useDispatch, useSelector } from 'react-redux';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { setcurrentRetailer } from 'features/retailersData/retailersSlice';

const RetailerDetails = () => {
  const navigate = useNavigate()
  const { currentRetailer } = useSelector((state) => state.retailers); // adjust this selector to match your store
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setcurrentRetailer({})); // Dispatch an action to reset retailer
    }
  }, [currentRetailer, dispatch])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <button onClick={() => {
        navigate('/retailers')
      }} id="backButton">Go Back</button>
      {currentRetailer && Object.keys(currentRetailer).length > 0 ? (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableBody>
              {Object.entries(currentRetailer).map(([field, value]) => (
                field !== '_id' && field !== '__v' && field !== 'password' && field !== 'isActivated' && field !== 'isretailer' && (
                  <TableRow key={field}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'DodgerBlue' }}>
                      {field}
                    </TableCell>
                    <TableCell>{value}</TableCell>
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

export default RetailerDetails;
