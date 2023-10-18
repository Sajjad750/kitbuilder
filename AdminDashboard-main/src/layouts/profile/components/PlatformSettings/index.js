
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(false);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(false);
  const [newLaunches, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          platform settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          account
        </MDTypography>
        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={followsMe} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me when someone book a quote
            </MDTypography>
          </MDBox>
        </MDBox> */}

        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={answersPost}  />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me when someone texts me
            </MDTypography>
          </MDBox>
        </MDBox> */}

        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={mentionsMe}  />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me when someone does a payment
            </MDTypography>
          </MDBox>
        </MDBox> */}

        {/* <MDBox mt={3}>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            application
          </MDTypography>
        </MDBox> */}

        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={newLaunches}  />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              New launches and projects
            </MDTypography>
          </MDBox>
        </MDBox> */}

        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={productUpdate}  />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Monthly product updates
            </MDTypography>
          </MDBox>
        </MDBox> */}

        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Subscribe to newsletter
            </MDTypography>
          </MDBox>
        </MDBox> */}

      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
