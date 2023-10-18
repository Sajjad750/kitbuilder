
import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";

// KitBuilder Dashboard React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// KitBuilder Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// KitBuilder Dashboard React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// KitBuilder Dashboard React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";


// Signin and signup

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import NotFoundPage from "404Page";
import AlertDialog from "layouts/confirmation/confirmation";
import Spinner from './loading'
import Notifications from "layouts/notifications";
import CustomizedSnackbars from "./Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfoData } from "features/adminData/adminSlice";
import { fetchAdmin } from "features/adminData/adminSlice";
import { fetchRetailers } from "features/retailersData/retailersSlice";
import { fetchNotActivatedRetailers } from "features/retailersData/retailersSlice";
import { fetchProducts } from "features/productsData/productsSlice";
import { fetchCategories } from "features/cartegoriesData/categoriesSlice";
import { fetchCatData } from "features/cartegoriesData/categoriesSlice";
import { fetchQuotesData } from "features/adminData/adminSlice";
import Loading from "components/Loading/loading";
import { fetchFiles } from "features/filesData/filesSlice";
import { fetchActivatedDisabledRetailers } from "features/retailersData/retailersSlice";
import { fetchActivatedNotDisabledRetailers } from "features/retailersData/retailersSlice";

// KitBuilder Dashboard React routes
import {AdminroutesObject,RetailerRoutesObject} from "routes";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {isAuthenticated,infoData,userRole} = useSelector(state => state.admin)
  // const [isAuthenticated,setisAuthenticated] = useState(false)
  const dispatchData = useDispatch()
  const routes = userRole === "admin" ? AdminroutesObject : userRole === "retailer" ? RetailerRoutesObject : [];

  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  // const [isAuthenticated, setisAuthenticated] = useState(false);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);
  

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  // useEffect(() => {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  // }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse && isAuthenticated) {
        return getRoutes(route.collapse);
      }
      if (route.route && isAuthenticated) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

    // ########### All API Requests Goes Here ########### 

    useEffect(() => {
      dispatchData(fetchFiles(isAuthenticated));
    }, [dispatchData]);

    // Calls Related to Home / Page
    useEffect(()=>{
      if(isAuthenticated){
        dispatchData(fetchInfoData(isAuthenticated))
      }
    },[dispatchData,isAuthenticated])

    // Calls Related to Profile Page

    useEffect(()=>{
      if(isAuthenticated){
        dispatchData(fetchAdmin(isAuthenticated));
      }
    },[dispatchData,isAuthenticated])

    // Calls Related to Retailers Page
    useEffect(() => {
      if(isAuthenticated){
        dispatchData(fetchRetailers(isAuthenticated));
      }
    }, [dispatchData,isAuthenticated]);

    useEffect(() => {
      if(isAuthenticated){
      dispatchData(fetchNotActivatedRetailers());
      dispatchData(fetchActivatedDisabledRetailers());
      dispatchData(fetchActivatedNotDisabledRetailers())
      }
    }, [dispatchData,isAuthenticated]);

      // Calls Related to Product Page
      useEffect(() => {
        if(isAuthenticated){
        dispatchData(fetchProducts(isAuthenticated));
        }
      }, [dispatchData,isAuthenticated]);

      // Calls Related to Category Page
      useEffect(() => {
        if(isAuthenticated){
        dispatchData(fetchCategories(isAuthenticated));
        dispatchData(fetchCatData(isAuthenticated))
        }
      }, [dispatchData,isAuthenticated]);
      // Calls Related to Quotes Page
      useEffect(() => {
        if(isAuthenticated){
          dispatchData(fetchQuotesData(isAuthenticated));
        }
      }, [dispatchData,isAuthenticated]);
    

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
    
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <AlertDialog/>
        {/* <CustomizedSnackbars/> */}
        <Spinner/>
        {layout === "dashboard" && (
          <>
          {
         isAuthenticated && <>
            <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="KitBuilder Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
         </>
          }
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {
         isAuthenticated && getRoutes(routes)
          }
          {
            !isAuthenticated ? <>
        <Route path="/authentication/sign-in" element={<SignIn />} />
        {/* <Route path="/authentication/sign-up" element={<SignUp />} /> */}
            </> : null
          }



          <Route path="/404" element={<NotFoundPage />} />
          {
          isAuthenticated ? (
            <>
              <Route  path="/" element={<Navigate to="/dashboard" />} />
              <Route exact path="*" element={<Navigate to="/dashboard" />} />
              <Route exact element={<Loading />} />

              {/* <Route exact path="/authentication/sign-in" element={<Navigate to="/dashboard" />} />
              <Route exact path="/authentication/sign-up" element={<Navigate to="/dashboard" />} /> */}

            </>
          ) : (
            <>
              <Route exact path="/" element={<Navigate to="/authentication/sign-in" />} />
              <Route exact path="*" element={<Navigate to="/authentication/sign-in" />} />
            </>
          )
        }

        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          {
         isAuthenticated && <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="KitBuilder Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
         </>
          }

        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
          {
         isAuthenticated && getRoutes(routes)
          }
          {
            !isAuthenticated ? <>
        <Route path="/authentication/sign-in" element={<SignIn />} />
        {/* <Route path="/authentication/sign-up" element={<SignUp />} /> */}
            </> : null
          }

        {/* <Notifications/> */}
        <Route path="/404" element={<NotFoundPage />} />
        {
          isAuthenticated ? (
            <>
              <Route  path="/" element={<Navigate to="/dashboard" />} />
              <Route exact path="*" element={<Navigate to="/dashboard" />} />
              <Route exact element={<Loading />} />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Navigate to="/authentication/sign-in" />} />
              <Route exact path="*" element={<Navigate to="/authentication/sign-in" />} />
            </>
          )
        }
      </Routes>
      <AlertDialog  />
      {/* <CustomizedSnackbars/> */}
      <Spinner/>
    </ThemeProvider>
  );
}
