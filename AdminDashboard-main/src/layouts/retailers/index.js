
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// KitBuilder Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from 'layouts/retailers/data/pendingRetailers'
import projectsTableData from 'layouts/retailers/data/registeredRetailers'
import deactiveRetailersTableData from 'layouts/retailers/data/deactivatedRetailers'
import activatedRetailersTableData from 'layouts/retailers/data/activatedRetailers'
// import authorsTableData from "layouts/tables/data/pendingRetailers";
// import projectsTableData from "layouts/tables/data/registeredRetailers";
import EditRetailerProfile from "./profileUpdate/RetailerProfileUpdate";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



function Tables() {
  // ALL Retailers
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const { columns: dColumns, rows: dRows } = deactiveRetailersTableData();
  const { columns: aColumns, rows: aRows } = activatedRetailersTableData();
  const {isRetailerProfile} = useSelector(state => state.retailers)

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Pending Retailers Approval
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  All Retailers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  
                />
              </MDBox>
              <MDBox>
                {
                  isRetailerProfile  ? isRetailerProfile.active ?  <EditRetailerProfile /> : null  : null
                }
                 
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Deactivated Retailers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: dColumns, rows: dRows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  
                />
              </MDBox>
              {/* <MDBox>
                {
                  isRetailerProfile  ? isRetailerProfile.active ?  <EditRetailerProfile /> : null  : null
                }
              </MDBox> */}
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Activated Retailers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: aColumns, rows: aRows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  
                />
              </MDBox>
              {/* <MDBox>
                {
                  isRetailerProfile  ? isRetailerProfile.active ?  <EditRetailerProfile /> : null  : null
                }
              </MDBox> */}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
