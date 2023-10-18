

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// KitBuilder Dashboard React base styles
import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;

  return (
    <MDBox width="100%" bottom={0} py={4}>
      {/*  position="absolute" */}
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "dark" : "text"}
            fontSize={size.sm}
          >
            &copy; {new Date().getFullYear()}, made with
            <MDBox fontSize={size.md} color={light ? "dark" : "dark"} mb={-0.5} mx={0.25}>
              <Icon color="inherit" fontSize="inherit">
                favorite
              </Icon>
            </MDBox>
            by
            <Link href="" target="_blank">
              <MDTypography variant="button" fontWeight="medium" color={light ? "dark" : "dark"}>
                &nbsp;Baron Tech&nbsp;
              </MDTypography>
            </Link>
            for a better web.
          </MDBox>
          <MDBox
            component="ul"
            sx={({ breakpoints }) => ({
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              listStyle: "none",
              mt: 3,
              mb: 0,
              p: 0,

              [breakpoints.up("lg")]: {
                mt: 0,
              },
            })}
          >
            <MDBox component="li" pr={2} lineHeight={1}>
              <Link href="" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "dark"}
                >
                  Baron Tech
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href="" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "dark"}
                >
                  About Us
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href="" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "dark"}
                >
                  Blog
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" pl={2} lineHeight={1}>
              <Link href="" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "dark"}
                >
                  License
                </MDTypography>
              </Link>
            </MDBox>
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
