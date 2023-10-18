import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Paper, Container, Card, CardMedia } from '@mui/material';
import CustomButton from '../../components/customButton/customButton';
import CustomStepper from '../../components/customStepper/CustomStepper';
import { Link, useNavigate } from 'react-router-dom';
// import SearchBar from '../../components/searchBar/SearchBar';
// import ProductGrid from '../../components/productGrid/ProductGrid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
//  
import { fetchCategories, searchCategories, setIsSearchActive, setselectedCategoryName, setLimit, setPage, } from '../../redux/Categories/categorySlice';
import { closeLoader, openLoader } from '../../redux/Loader/loaderSlice'
import { setPathColors, setactiveproduct } from '../../redux/userData/userdataSlice';
import { setselectedDesignId } from '../../redux/canvasData/canvasData'
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import { useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const ProductCard = ({ product, onProductClick }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [clickCount, setClickCount] = useState(0);

    const dispatch = useDispatch()
    const { selectedcolors, pathColors } = useSelector((state) => state.userdata);
    const hasColored = useRef(false);

    useEffect(() => {
        // If SVG has been colored, exit the useEffect
        if (hasColored.current) return;

        const colorSvg = (link) => {
            // Fetch the SVG content from the remote link
            fetch(link)
                .then(response => response.text())
                .then(data => {
                    const svgDom = new DOMParser().parseFromString(data, 'image/svg+xml');
                    // alert("processing...")
                    // Get all the paths in the SVG
                    const paths = svgDom.querySelectorAll('path');

                    // Map to store colors associated with keywords
                    const keywordColorMap = {};
                    const newPathColors = {}; // Temporary object to store colors

                    // Iterate over each path
                    paths.forEach(path => {
                        const name = path.getAttribute('id') || ''; // assuming the name is stored in 'id'
                        const keywords = name.split(/[_\s]/); // split on underscores or spaces

                        let colorToApply;
                        for (let keyword of keywords) {
                            if (keywordColorMap[keyword]) {
                                colorToApply = keywordColorMap[keyword];
                                break;
                            }
                        }

                        if (!colorToApply) {
                            colorToApply = selectedcolors[Math.floor(Math.random() * selectedcolors.length)];
                            for (let keyword of keywords) {
                                keywordColorMap[keyword] = colorToApply;
                            }
                        }

                        path.setAttribute('fill', colorToApply);
                        path.style.fill = colorToApply;

                        newPathColors[name] = colorToApply; // Store the color in the temporary object
                    });

                    dispatch(setPathColors(newPathColors))
                    setSvgContent(svgDom.documentElement.outerHTML);
                });
        };

        colorSvg(product.linkback); // Color the backside SVG
        colorSvg(product.linkfront);


        hasColored.current = true; // Set the ref to true after coloring the SVG

    }, [product.linkfront, product.linkback]); // Added product.linkback to the dependency array



    const handleProductClick = () => {
        setClickCount(prevCount => prevCount + 1);
        onProductClick(product, pathColors); // Pass the colors to the callback
    };

    return (
        <Grid onClick={handleProductClick} item xs={6} md={4} lg={3} key={product._id}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: "pointer",
                '&:hover': {
                    backgroundColor: '#f5f5f5'
                }
            }}>
                <div dangerouslySetInnerHTML={{ __html: svgContent }} style={{ height: "140px" }} />
                <Typography
                    variant="body2"
                    component="div"
                    className='nunito-r'
                    sx={{
                        textAlign: "center",
                        color: "white",
                        background: "#960909",
                        padding: "0.5em",
                        fontSize: "0.8rem"
                    }}>
                    {product.name}
                </Typography>
            </Card>
        </Grid>
    );
}
 
const ChooseKit = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";
    const steps = ['Enter Brand Name & Choose Colors', 'Choose your kit', 'Design more kit & Order your personalized kit'];

    const { categoriesData, relatedProducts, hasMoreCategories, searchedCategories, isLoading, error, page, limit } = useSelector((state) => state.categories)
    const { activeproduct } = useSelector((state) => state.userdata)
    const dispatch = useDispatch()
    const [currentCategory, setCurrentCategory] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const navigate = useNavigate()
    // const [page, setPage] = useState(1);
    // const [limit, setLimit] = useState(2);
    const [inputValue, setInputValue] = useState("");
    const latestRequest = useRef(null);

    const debouncedApiCall = debounce((searchValue, currentPage) => {
        const currentRequest = Date.now();
        latestRequest.current = currentRequest;

        // Check if the cookie 'retId' exists and is not empty
        // let encryptedRetId = Cookies.get('retId');
        let encryptedRetId = JSON.parse(Cookies.get('retId'));
        // console.log(encryptedRetId,"encryptedRetId data")
        if (!encryptedRetId) {
            // console.error("Cookie 'retId' is not present or empty.");
            alert("Please enable the cookies for optimal experience of the application or refresh the page.");
            return; // Exit the function early
        }

        // encryptedRetId = JSON.parse(encryptedRetId);

        if (!searchValue || searchValue.trim() === '') {
            dispatch(fetchCategories({ id: JSON.stringify(encryptedRetId), page: currentPage, limit: limit }));
            // dispatch(fetchCategories({ id: JSON.stringify(encryptedRetId), page: currentPage, limit: limit }));
        } else {
            console.log("API call with value:", searchValue);
            dispatch(searchCategories({
                id: JSON.stringify(encryptedRetId),
                searchTerm: searchValue,
                page: currentPage,
                limit: limit
            }));
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
            dispatch(closeLoader(false))
        }
    }, [isLoading])

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
            navigate('/askname');
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
    const displayedCategories = currentCategory && currentCategory.children ? currentCategory.children : categoriesData;
    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden', // To ensure content fits in 100vh
            }}
        >
            <Box sx={{ maxWidth: "1440px", margin: 'auto' }}>

                <Grid container spacing={2}> {/* added spacing prop */}
                    <Grid item xs={12} md={7}>
                        <Grid container item xs={12} justifyContent="center" alignItems="center" style={{ marginTop: "10%" }}>
                            <CustomStepper activeStep={1} steps={steps} />
                        </Grid>


                        <Grid container item xs={12} mt={10} justifyContent="center" alignItems="center" >
                            <Box display="flex" flexDirection="column" width="90%">
                                <Box mb={2} flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                                    <Typography className='nunito-b' sx={{ fontSize: "32px", color: "white", mb: 2 }}>
                                        Choose your Kit
                                    </Typography>
                                    {/* <SearchBar /> */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',  // Semi-transparent white for border
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        backgroundColor: 'rgba(211, 211, 211, 0.3)', // Light grey with transparency
                                    }}>
                                        <IconButton style={{ padding: '0', marginLeft: '8px', color: 'white' }}>
                                            <SearchIcon />
                                        </IconButton>
                                        <InputBase
                                            className='nunito-r'
                                            placeholder="Search your shirt type here..."
                                            inputProps={{ 'aria-label': 'search' }}
                                            style={{
                                                flex: 1,
                                                marginLeft: '8px',
                                                color: 'white'
                                            }}
                                            value={inputValue}
                                            onChange={handleInputChange}

                                        />

                                    </div>
                                </Box>

                                <Container className='nunito-r' sx={{ padding: "2vh", overflowY: "auto" }}>
                                    <Typography className='nunito-r' variant="h5" component="div">
                                        {breadcrumb && breadcrumb.map((category, index) => (
                                            <React.Fragment key={category._id}>
                                                {index > 0 && (
                                                    <span style={{ marginRight: '3px', fontSize: '80%', color: "white" }}>/</span>
                                                )}
                                                <Button
                                                    className='nunito-r'
                                                    sx={{ color: "white" }}
                                                    onClick={() => handleBreadcrumbClick(index)}
                                                >
                                                    {category.name}
                                                </Button>
                                            </React.Fragment>
                                        ))}
                                    </Typography>


                                    <Grid container spacing={2}>
                                        {displayedProducts && displayedProducts.map((product) => (
                                            <ProductCard
                                                product={product}
                                                onProductClick={() => {
                                                    dispatch(setselectedDesignId(""));
                                                    dispatch(setactiveproduct({ _id: product._id, linkfront: product.linkfront, linkback: product.linkback, name: product.name }));
                                                    navigate('/editor');
                                                }}
                                            />
                                        ))}
                                        {/* {displayedProducts && displayedProducts.map((product) => (
                                            <Grid onClick={() => {
                                                dispatch(setselectedDesignId(""))
                                                dispatch(setactiveproduct({ _id: product._id, linkfront: product.linkfront, linkback: product.linkback, name: product.name }));
                                                navigate('/editor')
                                            }} item xs={6} md={4} lg={3} key={product._id}>
                                                <Card sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    cursor: "pointer",
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}>
                                                    <img
                                                        src={product.linkfront}
                                                        alt={product.name}
                                                        style={{
                                                            height: "140px",
                                                            objectFit: "contain"
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        component="div"
                                                        className='nunito-r'
                                                        sx={{
                                                            textAlign: "center",
                                                            color: "white",
                                                            background: "#960909",
                                                            padding: "0.5em",
                                                            fontSize: "0.8rem"
                                                        }}>
                                                        {product.name}
                                                    </Typography>
                                                </Card>

                                            </Grid>
                                        ))} */}

                                        {displayedCategories && displayedCategories.map((category) => (
                                            <Grid item xs={6} md={4} lg={3} key={category._id} onClick={() => handleClick(category)}>
                                                <Paper sx={{ cursor: "pointer", border: "2px solid white" }} elevation={2} >
                                                    <Box justifyContent="center" alignItems="center" height="100%">
                                                        <Box sx={{
                                                            textAlign: "center",
                                                            background: "white",
                                                            height: "140px", // Set a fixed height
                                                            overflow: "hidden" // Hide any overflowing content
                                                        }}>
                                                            <img style={{
                                                                width: "100%",
                                                                maxWidth: "140px",
                                                                height: "auto",
                                                                maxHeight: "140px",
                                                                objectFit: "contain" // Ensure the image scales correctly
                                                            }} src={category.image} />
                                                        </Box>

                                                        <Typography
                                                            variant="body2"
                                                            component="div"
                                                            className='nunito-r'
                                                            onClick={() => {
                                                                dispatch(setselectedCategoryName(category.name))
                                                            }}
                                                            sx={{
                                                                textAlign: "center",
                                                                color: "white",
                                                                background: "#960909",
                                                                padding: "0.5em",
                                                                fontSize: "0.8rem"
                                                            }}>
                                                            {category.name}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Container>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ width: "90%", margin: "6vh auto" }}> {/* changed margin */}
                        <Box md="auto" sx={{ margin: "0px 0px 60px 0px" }}>
                            {
                                page > 1 && <Button
                                    variant="contained"
                                    sx={{
                                        background: "#960909", marginRight: "10px", '&:hover': {
                                            backgroundColor: 'white', // Change to desired hover color
                                            color: '#960909' // Change to desired hover font color
                                        }
                                    }}
                                    onClick={() => {
                                        if (page > 1) {
                                            dispatch(setPage(page - 1));
                                        }
                                    }}
                                    startIcon={<ArrowBackIcon />}
                                >
                                </Button>
                            }
                            {
                                hasMoreCategories && <Button
                                    variant="contained"
                                    sx={{
                                        background: "#960909", '&:hover': {
                                            backgroundColor: 'white', // Change to desired hover color
                                            color: '#960909' // Change to desired hover font color
                                        }
                                    }}
                                    onClick={() => {
                                        dispatch(setPage(page + 1));
                                    }}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                </Button>
                            }


                        </Box>
                        <Grid container item xs={12} sm={12} md={12} direction={{ xs: 'column', sm: 'column', md: 'row' }} justifyContent={{ xs: 'center', sm: 'center', md: 'space-between' }} alignItems="center">
                            <Grid item xs={12} sm={12} md="auto" sx={{ marginBottom: { xs: 1, sm: 1, md: 0 } }}>
                                <CustomButton
                                    className="nunito-b"
                                    backgroundColor="#960909"
                                    fontColor="white"
                                    hoverColor="white"
                                    hoverFontColor="#960909"
                                    borderRadius="30px"
                                    border="2px solid #960909"
                                    width="150px"
                                    height="50px"
                                    onClick={handlePreviousClick}
                                >
                                    Previous
                                </CustomButton>
                            </Grid>
                        </Grid>

                    </Box>
                </Grid>
            </Box>
        </Box>
    );
}

export default ChooseKit;
