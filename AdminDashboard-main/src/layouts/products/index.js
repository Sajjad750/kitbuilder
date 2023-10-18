
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
// import authorsTableData from "layouts/tables/data/pendingRetailers";
import authorsTableData from "layouts/products/data/productsData";
import ProductDetailsPage from "./productDetails/productDetails";
import { useSelector } from "react-redux";
import EditProductData from "./productUpdate/productDataUpdate";

function Tables() {
  // ALL Retailers
  const { columns, rows } = authorsTableData();
    const {activeProduct,isProductEdit} = useSelector((state) => state.products);


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
                  Products
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
          {
            activeProduct.length > 0 ? <>
            <ProductDetailsPage/>
            </> : null
          }
          {
            isProductEdit.active ? <>
              <EditProductData/>
            </>:null
          }
          
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
