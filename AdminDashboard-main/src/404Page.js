import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import React from 'react';
import error from './assets/images/error.jpg'
const NotFoundPage = () => {
  return (
    <div>
    <h1 style={{textAlign:"center",color:"#3C50A7"}}>404 Not Found</h1>
    <img src={error} style={{width:"100%"}} />
    </div>
  );
};

export default NotFoundPage;
