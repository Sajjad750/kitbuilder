import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import './quoteDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrentQuote } from 'features/adminData/adminSlice';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const CustomTable = () => {
  const navigate = useNavigate();
  const { currentQuote } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentQuote, "currentQuote");
  }, [currentQuote]);

  useEffect(() => {
    return () => {
      dispatch(setcurrentQuote({})); // Dispatch an action to reset quote
    };
  }, [currentQuote, dispatch]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <button onClick={() => {
        navigate('/quotes');
      }} id="backButton">Go Back</button>
      {currentQuote && Object.keys(currentQuote).length > 0 ? (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableBody>
              {Object.entries(currentQuote).map(([field, value]) => {
                if (field === '_id' || field === '__v') return null;

                return (
                  <TableRow key={field}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'DodgerBlue' }}>
                      {field === "linkFront" ? "Front Design" : field === "linkBack" ? "Back Design" : field}
                    </TableCell>
                    <TableCell>
                      {(field === 'linkFront' || field === 'linkBack')
                        ? <img src={value} alt={field} />
                        : typeof value === 'object'
                          ? Object.entries(value).map(([subField, subValue]) => (
                            <div key={subField}>
                              {subField}: {JSON.stringify(subValue)}
                            </div>
                          ))
                          : value
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No data available</div>
      )}
    </DashboardLayout>
  );
};

export default CustomTable;
