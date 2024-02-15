import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Card,
  //   CardMedia,
} from "@mui/material";
// import CustomButton from "../../components/customButton/customButton";
import CustomStepper from "../../components/customStepper/CustomStepper";
import { Link, useNavigate } from "react-router-dom";
// import SearchBar from '../../components/searchBar/SearchBar';
// import ProductGrid from '../../components/productGrid/ProductGrid';
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
//
import {
  fetchCategories,
  searchCategories,
  setIsSearchActive,
  setselectedCategoryName,
  setLimit,
  setPage,
} from "../../redux/Categories/categorySlice";
import { closeLoader, openLoader } from "../../redux/Loader/loaderSlice";
import {
  setPathColors,
  setactiveproduct,
} from "../../redux/userData/userdataSlice";
import { setselectedDesignId } from "../../redux/canvasData/canvasData";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash/debounce";
import { useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styled from "styled-components";

// component
import BlackOverlay from "../../components/templates/overlays/blackOverlay";
import ImageBackground from "../../components/templates/imagesComponent/ImageBackground";
import WhiteButton from "../../components/templates/button/WhiteButton";
import OutlinedButton from "../../components/templates/button/OutlinedButton";

// Styles
const Containers = styled.div`
  height: 100vh;
  position: relative;
  z-index: 0;
`;

const FormWrapper = styled.div`
  width: 80%;
  margin: 4rem auto 0 auto;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ArrowButtonWrapper = styled.div``;

const CtaButtonWrapper = styled.div``;

const ProductCard = ({ product, onProductClick }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const dispatch = useDispatch();
  const { selectedcolors, pathColors } = useSelector((state) => state.userdata);
  const hasColored = useRef(false);

  useEffect(() => {
    // If SVG has been colored, exit the useEffect
    if (hasColored.current) return;

    const colorSvg = (link) => {
      // Fetch the SVG content from the remote link
      fetch(link)
        .then((response) => response.text())
        .then((data) => {
          const svgDom = new DOMParser().parseFromString(data, "image/svg+xml");
          // alert("processing...")
          // Get all the paths in the SVG
          const paths = svgDom.querySelectorAll("path");

          // Map to store colors associated with keywords
          const keywordColorMap = {};
          const newPathColors = {}; // Temporary object to store colors

          // Iterate over each path
          paths.forEach((path) => {
            const name = path.getAttribute("id") || ""; // assuming the name is stored in 'id'
            const keywords = name.split(/[_\s]/); // split on underscores or spaces

            let colorToApply;
            for (let keyword of keywords) {
              if (keywordColorMap[keyword]) {
                colorToApply = keywordColorMap[keyword];
                break;
              }
            }

            if (!colorToApply) {
              colorToApply =
                selectedcolors[
                  Math.floor(Math.random() * selectedcolors.length)
                ];
              for (let keyword of keywords) {
                keywordColorMap[keyword] = colorToApply;
              }
            }

            path.setAttribute("fill", colorToApply);
            path.style.fill = colorToApply;

            newPathColors[name] = colorToApply; // Store the color in the temporary object
          });

          dispatch(setPathColors(newPathColors));
          setSvgContent(svgDom.documentElement.outerHTML);
        });
    };

    colorSvg(product.linkback); // Color the backside SVG
    colorSvg(product.linkfront);

    hasColored.current = true; // Set the ref to true after coloring the SVG
  }, [product.linkfront, product.linkback]); // Added product.linkback to the dependency array

  const handleProductClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    onProductClick(product, pathColors); // Pass the colors to the callback
  };

  return (
    <Grid
      onClick={handleProductClick}
      item
      xs={6}
      md={4}
      lg={3}
      key={product._id}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ height: "140px" }}
        />
        <Typography
          variant="body2"
          component="div"
          className="nunito-r"
          sx={{
            textAlign: "center",
            color: "white",
            background: "#960909",
            padding: "0.5em",
            fontSize: "0.8rem",
          }}
        >
          {product.name}
        </Typography>
      </Card>
    </Grid>
  );
};

const ChooseKit = () => {
  const backgroundImageURL =
    "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";
  const steps = [
    // "Enter Brand Name & Choose Colors",
    // "Choose your kit",
    // "Design more kit & Order your personalized kit",
    "Brand Identity",
    "Kit Selection",
    "Design & Order",
  ];

  const {
    categoriesData,
    relatedProducts,
    hasMoreCategories,
    searchedCategories,
    isLoading,
    error,
    page,
    limit,
  } = useSelector((state) => state.categories);
  const { activeproduct } = useSelector((state) => state.userdata);
  const dispatch = useDispatch();
  const [currentCategory, setCurrentCategory] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const navigate = useNavigate();
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(2);
  const [inputValue, setInputValue] = useState("");
  const latestRequest = useRef(null);

  const debouncedApiCall = debounce((searchValue, currentPage) => {
    const currentRequest = Date.now();
    latestRequest.current = currentRequest;

    // Check if the cookie 'retId' exists and is not empty
    // let encryptedRetId = Cookies.get('retId');
    let encryptedRetId = JSON.parse(Cookies.get("retId"));
    // console.log(encryptedRetId,"encryptedRetId data")
    if (!encryptedRetId) {
      // console.error("Cookie 'retId' is not present or empty.");
      alert(
        "Please enable the cookies for optimal experience of the application or refresh the page."
      );
      return; // Exit the function early
    }

    // encryptedRetId = JSON.parse(encryptedRetId);

    if (!searchValue || searchValue.trim() === "") {
      dispatch(
        fetchCategories({
          id: JSON.stringify(encryptedRetId),
          page: currentPage,
          limit: limit,
        })
      );
      // dispatch(fetchCategories({ id: JSON.stringify(encryptedRetId), page: currentPage, limit: limit }));
    } else {
      console.log("API call with value:", searchValue);
      dispatch(
        searchCategories({
          id: JSON.stringify(encryptedRetId),
          searchTerm: searchValue,
          page: currentPage,
          limit: limit,
        })
      );
    }
  }, 500);

  useEffect(() => {
    debouncedApiCall();
    // Cleanup
    return () => {
      debouncedApiCall.cancel();
    };
  }, [inputValue]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    dispatch(setPage(1));
  };

  useEffect(() => {
    try {
      debouncedApiCall(inputValue, page);
    } catch (error) {
      console.log(error);
    }
  }, [page, inputValue]);

  useEffect(() => {
    if (isLoading) {
      dispatch(openLoader(true));
    } else {
      dispatch(closeLoader(false));
    }
  }, [isLoading]);

  const handleClick = (category) => {
    setCurrentCategory(category);
    setDisplayedProducts(category.products || []);
    setBreadcrumb([...breadcrumb, category]);
  };

  const handleBack = () => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
      setBreadcrumb(newBreadcrumb);
      const newCurrentCategory = newBreadcrumb[newBreadcrumb.length - 1];
      setCurrentCategory(newCurrentCategory);
      setDisplayedProducts(newCurrentCategory.products || []);
    } else {
      setCurrentCategory(null);
      setBreadcrumb([]);
      setDisplayedProducts([]);
    }
  };

  const handlePreviousClick = () => {
    // Check if the user is in the top-most category
    if (breadcrumb && breadcrumb.length < 1) {
      // Navigate to the previous route
      navigate("/askname");
    } else {
      // Behave like the "Back" button
      handleBack();
    }
  };

  const handleBreadcrumbClick = (index) => {
    const selectedCategory = breadcrumb[index];
    if (selectedCategory.products && selectedCategory.products.length > 0) {
      setDisplayedProducts(selectedCategory.products);
    } else {
      setCurrentCategory(selectedCategory);
      setDisplayedProducts([]);
    }
    setBreadcrumb(breadcrumb.slice(0, index + 1));
  };

  // Define what categories to display based on currentCategory
  // const displayedCategories = currentCategory && currentCategory.children ? currentCategory.children : categoriesData;
  const displayedCategories =
    currentCategory && currentCategory.children
      ? currentCategory.children
      : categoriesData;
  return (
    <Containers>
      <BlackOverlay />
      <ImageBackground imagePath={backgroundImageURL} />
      <Grid container spacing={2} justifyContent="center">
        {/* added spacing prop */}
        <Grid item xs={12} md={7}>
          <Grid
            container
            item
            xs={12}
            justifyContent="center"
            alignItems="center"
            style={{ marginTop: "10%" }}
          >
            <CustomStepper activeStep={1} steps={steps} />
          </Grid>

          <FormWrapper>
            <Typography
              className="nunito-b"
              sx={{
                fontSize: "32px",
                color: "white",
                mb: 2,
                textAlign: "center",
              }}
            >
              Choose your Kit
            </Typography>
            {/* <SearchBar /> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(255, 255, 255, 0.3)", // Semi-transparent white for border
                borderRadius: "4px",
                padding: "4px 8px",
                backgroundColor: "rgba(211, 211, 211, 0.3)", // Light grey with transparency
              }}
            >
              <IconButton
                style={{
                  padding: "0",
                  marginLeft: "8px",
                  color: "white",
                }}
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                className="nunito-r"
                placeholder="Search your shirt type here..."
                inputProps={{ "aria-label": "search" }}
                style={{
                  flex: 1,
                  marginLeft: "8px",
                  color: "white",
                }}
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>

            <Container
              className="nunito-r"
              sx={{ padding: "2vh", overflowY: "auto" }}
            >
              <Typography className="nunito-r" variant="h5" component="div">
                {breadcrumb &&
                  breadcrumb?.map((category, index) => (
                    <React.Fragment key={category._id}>
                      {index > 0 && (
                        <span
                          style={{
                            marginRight: "3px",
                            fontSize: "80%",
                            color: "white",
                          }}
                        >
                          /
                        </span>
                      )}
                      <Button
                        className="nunito-r"
                        sx={{ color: "white" }}
                        onClick={() => handleBreadcrumbClick(index)}
                      >
                        {category.name}
                      </Button>
                    </React.Fragment>
                  ))}
              </Typography>

              <Grid container spacing={2}>
                {displayedProducts &&
                  displayedProducts?.map((product) => (
                    <ProductCard
                      product={product}
                      onProductClick={() => {
                        dispatch(setselectedDesignId(""));
                        dispatch(
                          setactiveproduct({
                            _id: product._id,
                            linkfront: product.linkfront,
                            linkback: product.linkback,
                            name: product.name,
                          })
                        );
                        navigate("/editor");
                      }}
                    />
                  ))}

                {displayedCategories &&
                  displayedCategories?.map((category) => (
                    <Grid
                      item
                      xs={6}
                      md={4}
                      lg={3}
                      key={category._id}
                      onClick={() => handleClick(category)}
                    >
                      <Paper
                        sx={{
                          cursor: "pointer",
                          border: "2px solid white",
                        }}
                        elevation={2}
                      >
                        <Box
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                        >
                          <Box
                            sx={{
                              textAlign: "center",
                              background: "white",
                              height: "140px", // Set a fixed height
                              overflow: "hidden", // Hide any overflowing content
                            }}
                          >
                            <img
                              style={{
                                width: "100%",
                                maxWidth: "140px",
                                height: "auto",
                                maxHeight: "140px",
                                objectFit: "contain", // Ensure the image scales correctly
                              }}
                              src={category.image}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            component="div"
                            className="nunito-r"
                            onClick={() => {
                              dispatch(setselectedCategoryName(category.name));
                            }}
                            sx={{
                              textAlign: "center",
                              color: "white",
                              background: "#960909",
                              padding: "0.5em",
                              fontSize: "0.8rem",
                            }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>

              <ButtonContainer>
                {/* Arrow Button */}
                <ArrowButtonWrapper>
                  {page > 1 && (
                    <IconButton
                      variant="contained"
                      sx={{
                        background: "#960909",
                        marginRight: "10px",
                        color: "#fff",

                        "&:hover": {
                          backgroundColor: "white",
                          color: "#960909",
                        },
                      }}
                      onClick={() => {
                        if (page > 1) {
                          dispatch(setPage(page - 1));
                        }
                      }}
                      // startIcon={<ArrowBackIcon />}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  {hasMoreCategories && (
                    <IconButton
                      variant="contained"
                      sx={{
                        background: "#960909",
                        color: "#fff",

                        "&:hover": {
                          backgroundColor: "white",
                          color: "#960909",
                        },
                      }}
                      onClick={() => {
                        dispatch(setPage(page + 1));
                      }}
                      // endIcon={<ArrowForwardIcon />}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  )}
                </ArrowButtonWrapper>

                {/* CTA Button */}
                <CtaButtonWrapper>
                  <OutlinedButton handleClick={handlePreviousClick}>
                    Back
                  </OutlinedButton>
                </CtaButtonWrapper>
              </ButtonContainer>
            </Container>
          </FormWrapper>
        </Grid>
      </Grid>
    </Containers>
  );
};

export default ChooseKit;
