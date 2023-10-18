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
import { fetchCategories, searchCategories, setIsSearchActive } from '../../redux/Categories/categorySlice';
import { closeLoader, openLoader } from '../../redux/Loader/loaderSlice'
import { setactiveproduct } from '../../redux/userData/userdataSlice';
import { setselectedDesignId } from '../../redux/canvasData/canvasData'
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import { useRef } from 'react';


const ChooseKit = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";
    const steps = ['Enter Brand Name & Choose Colors', 'Choose your kit', 'Design more kit & Order your personalized kit'];

    const { categoriesData,hasMoreCategories,searchedCategories, error } = useSelector((state) => state.categories)
    const { activeproduct } = useSelector((state) => state.userdata)
    const dispatch = useDispatch()
    const [currentCategory, setCurrentCategory] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(2);
    const [inputValue, setInputValue] = useState("");
    const latestRequest = useRef(null);
    
    const debouncedApiCall = debounce(() => {
        const currentRequest = Date.now();
        latestRequest.current = currentRequest;    
        if (!inputValue || inputValue.trim() === '') {
            let encryptedRetId = JSON.parse(Cookies.get('retId'));
            dispatch(fetchCategories({ id: JSON.stringify(encryptedRetId), page: 1, limit: limit }));
            return; // Exit the function early
        }
        let encryptedRetId = JSON.parse(Cookies.get('retId'));
        console.log("API call with value:", inputValue);
        dispatch(searchCategories({ 
            id: JSON.stringify(encryptedRetId), 
            searchTerm: inputValue,
            page: page,
            limit: limit
        }));
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
        setPage(1);
    
        if (value.trim() === '') {
            const currentRequest = Date.now();
            latestRequest.current = currentRequest;
            debouncedApiCall.cancel();
            dispatch(setIsSearchActive(false));
            let encryptedRetId = JSON.parse(Cookies.get('retId'));
            dispatch(fetchCategories({ 
                id: JSON.stringify(encryptedRetId), 
                page: 1, 
                limit: limit 
            }))
        } else {
            debouncedApiCall();
        }
    };
    
    
    
    useEffect(() => {
        const handleScroll = () => {
            if (hasMoreCategories && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                setPage(page + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, hasMoreCategories]);  // Add hasMoreCategories dependency


    useEffect(() => {
        try {
            dispatch(openLoader(true));
            let encryptedRetId = JSON.parse(Cookies.get('retId'));
            dispatch(fetchCategories({ id: JSON.stringify(encryptedRetId), page: page, limit: limit }));
        } catch (error) {
            console.log(error);
        }
    }, [page]);
    

    useEffect(() => {
        if (categoriesData && categoriesData.length > 0) {
            dispatch(closeLoader(false))
        } else if (error) {
            dispatch(closeLoader(false))
            alert(error)
            console.log(error) // handle the error in a way you see fit
        }
    }, [categoriesData, error])


    const handleClick = (category) => {
        if (category.products && category.products.length > 0) {
            // if the category has products, display them
            setDisplayedProducts(category.products);
        } else {
            // if the category has no products, display its children
            setCurrentCategory(category);
            setDisplayedProducts([]);
        }
        setBreadcrumb([...breadcrumb, category]);
    };

    const handleBack = () => {
        if (breadcrumb && breadcrumb.length > 1) {
            setBreadcrumb(breadcrumb.slice(0, breadcrumb.length - 1));
            setCurrentCategory(breadcrumb[breadcrumb.length - 2]);
        } else {
            setCurrentCategory(null);
            setBreadcrumb([]);
        }
        setDisplayedProducts([]);
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
    const displayedCategories = currentCategory && currentCategory.children ? currentCategory.children : categoriesData;


    // This code is for adding encrypted retailer id into cookie
    // const fetchEncryptedId = async (id) => {
    //     try {
    //         const response = await axios.get(`http://localhost:5000/api/crypt/encrypt/?id=${id}`);
    //         console.log(response.data);
    //         // set a cookie
    //         Cookies.set('retId', JSON.stringify(response.data));
    //     } catch (error) {
    //         console.error('Failed to fetch encrypted ID: ', error);
    //     }
    // };

    // useEffect(() => {
    //     console.log("ok")
    //     fetchEncryptedId('64cb4bf8d9aed7298bcfaef4');
    // }, [])

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
                                {/* <ProductGrid /> */}

                                <Container  className='nunito-r' sx={{padding: "2vh", overflowY: "auto" }}>
                                    {breadcrumb && breadcrumb.length > 0 && (
                                        <Button
                                            className='nunito-r'
                                            sx={{
                                                background: '#960909',
                                                '&:hover': {
                                                    background: '#960909',
                                                },
                                            }}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleBack}
                                        >
                                            Back
                                        </Button>
                                    )}

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
                                        {/* display products if there are any */}
                                        {displayedProducts && displayedProducts.length > 0 && displayedProducts.map((product) => (
                                            <Grid onClick={() => {
                                                // Selected design id is being set to true so that it must not load the design from lcoal storage or from saveddesign
                                                dispatch(setselectedDesignId(""))
                                                dispatch(setactiveproduct({ linkfront: product.linkfront, linkback: product.linkback }));
                                                navigate('/editor')
                                            }} item xs={6} md={4} lg={3} key={product._id}>
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: "pointer",
                                                        '&:hover': {
                                                            backgroundColor: '#f5f5f5'
                                                        }
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        image={product.productImage}
                                                        alt={product.name}
                                                    />
                                                </Card>
                                            </Grid>
                                        ))}
                                        {/* else, display categories */}
                                        {displayedProducts && displayedProducts.length === 0 && displayedCategories && displayedCategories.map((category) => (
                                            <Grid item xs={6} md={4} lg={3} key={category._id} onClick={() => handleClick(category)}>
                                                <Paper sx={{ cursor: "pointer", border: "2px solid white" }} elevation={2} >
                                                    <Box justifyContent="center" alignItems="center" height="100%">
                                                        <Box sx={{ textAlign: "center", background: "white" }}>
                                                            <img style={{ width: "100%", maxWidth: "140px", height: "100%" }} src={category.image} /> {/* Increased image size */}
                                                        </Box>
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
                    <Box sx={{ width: "90%", margin: "10vh auto" }}> {/* changed margin */}
                        <Grid container item xs={12} sm={12} md={12} direction={{ xs: 'column', sm: 'column', md: 'row' }} justifyContent={{ xs: 'center', sm: 'center', md: 'space-between' }} alignItems="center">
                            <Grid item xs={12} sm={6} md="auto" sx={{ marginBottom: { xs: 1, sm: 1, md: 0 } }}>
                                <Link to="/askname">
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
                                        onClick={() => console.log('Previous button clicked!')}
                                    >
                                        Previous
                                    </CustomButton>
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={6} md="auto">
                                <Link to="/editor">
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
                                        onClick={() => console.log('Next button clicked!')}
                                    >
                                        Next
                                    </CustomButton>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
}

export default ChooseKit;
