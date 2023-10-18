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

import TicketData from "layouts/tickets/Tickets/TicketsData";

function Tickets() {

  const { openTickets, inProgressTickets, closedTickets, columns } = TicketData();

  console.log(openTickets,"openTickets openTickets")
//   console.log(inProgressTickets,"inProgressTickets inProgressTickets")
//   console.log(closedTickets,"closedTickets closedTickets")

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
                  Tickets Status Open
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: openTickets }}
                  showTotalEntries={true}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={true}
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
                  Tickets Status In_Progress
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: inProgressTickets  }}
                  showTotalEntries={true}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={true}
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
                  Tickets Status Closed
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: closedTickets  }}
                  showTotalEntries={true}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={true}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tickets;
