import { Box, Button, Grid, InputAdornment, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomStepper from '../../components/customStepper/CustomStepper';
import ColorSwatch from '../../components/customColorSwatch/ColorSwatch';
import CustomAccordion from '../../components/customAccordion/CustomAccordion';
import CustomButton from '../../components/customButton/customButton';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CanvasEditor } from '../../components/canvasEditor/canvasEditor';
import PathAccordion from '../../components/customAccordion/pathAccordion';
import LogoUpload from '../../components/logoUpload/LogoUpload';
import NewLogoUpload from '../../components/logoUpload/LogouploadComponent';
import MenuList from '../../components/menuList/menuList';
import AddText from '../../components/addTextField/addText';
import { fetchCategories, setrelatedKit, setrelatedProducts } from '../../redux/Categories/categorySlice';
import Slider from 'react-slick';
import { setactiveproduct } from '../../redux/userData/userdataSlice';
import { setselectedDesignId } from '../../redux/canvasData/canvasData';
import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from '../../config';
import Carousel3d from './react-3d-carousel';

const Editor = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1693304111/userUploads/Editor-Background_qvrjyb.png";
    // const steps = ['Choose Colors', 'Add Logos', 'Add Text'];
    const steps = ['Enter Brand Name & Choose Colors', 'Choose your kit', 'Design more kit & Order your personalized kit'];
    const theme = useTheme();
    const matches = useMediaQuery('(max-width:500px)');
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const buttonWidth = isMdUp ? "175px" : "140px"; // Adjust the smaller width as needed

    const [currentStep, setCurrentStep] = useState(1); // 1 for first component, 2 for second, and so on
    const navigate = useNavigate()
    const [view, setview] = useState(false)
    const [deletionIndex, setdeletionIndex] = useState(null)
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const { primary, secondary, sidecolor, selectedkit, activecomponent, activeproduct } = useSelector((state) => state.userdata)
    const { description, videoLink, imageGallery } = activeproduct;
    const { canvas, paths, activeside } = useSelector((state) => state.canvas)
    const { categoriesData, limit, page, relatedProducts, relatedKit, selectedCategoryName, hasMoreCategories, searchedCategories, error } = useSelector((state) => state.categories)
    const [prouctChangeTimeStamp, setprouctChangeTimeStamp] = useState(false)

    const dispatch = useDispatch()
    // Base URL
    let URL = config.url.API_URL

    // console.log(pathColors,"pathColors")

    const nextStep = () => {
        setCurrentStep(prevStep => {
            if (prevStep >= 3) {
                setIsButtonPressed(true);
                // navigate('/saveddesigns')
            }
            if (prevStep >= 1 && prevStep < 3) {
                // Scroll to the element with the ID 'editorsetting'
                const element = document.getElementById('editorsetting');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            return prevStep + 1;
        });
    };

    // editorsetting

    // Function to go back to previous component
    const prevStep = () => {
        setCurrentStep(prevStep => {
            if (prevStep <= 1) {
                navigate('/choosekit');
            }
            // Example: If you want to scroll to 'editorsetting' when prevStep is 2
            if (prevStep >= 1 || prevStep < 3) {
                const element = document.getElementById('editorsetting');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }

            return prevStep - 1;
        });
    };


    // useEffect(() => {
    //     if (!categoriesData || categoriesData.length === 0) {

    //         const encryptedRetId = Cookies.get('retId');

    //         if (!encryptedRetId) {
    //             alert("Please enable the cookies for optimal experience of the application or refresh the page.");
    //             return; // Exit early if no cookie found
    //         }

    //         const parsedEncryptedRetId = JSON.parse(encryptedRetId);

    //         dispatch(fetchCategories({ 
    //             id: JSON.stringify(parsedEncryptedRetId), 
    //             page: page, 
    //             limit: limit 
    //         }));
    //     }
    // }, [categoriesData]);
    // page, limit




    const items = [
        {
            image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1693312032/userUploads/image_1_svx4l6.png',
            label: 'Uniform',
        },
        {
            image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1693312032/userUploads/image_1_svx4l6.png',
            label: 'Uniform',
        },
        {
            image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1693312032/userUploads/image_1_svx4l6.png',
            label: 'Uniform',
        },
        {
            image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1693312032/userUploads/image_1_svx4l6.png',
            label: 'Uniform',
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const changeLayerColor = (color, layer) => {
        paths.forEach(function (path) {
            if (path.id === layer) {
                path.set({ 'fill': color });
                canvas.renderAll();
            }
        });
    }


    // const changeLayerColor = (color, layer) => {
    //     // alert("ok")
    //     paths.forEach(function (path) {
    //         if (path.id === layer) {
    //             // alert("id matched and worked")
    //             path.set({ 'fill': color });
    //             canvas.requestRenderAll()
    //             // canvas.renderAll();
    //         }
    //     });
    // }


    // const getRelatedProducts = () => {
    //     // Find the category that contains the active product
    //     const activeCategory = categoriesData.find(category =>
    //         category.products.some(product => product._id === activeproduct._id)
    //     );
    //     // If no active category is found, return an empty array
    //     if (!activeCategory) return [];
    //     // Extract related products from the active category, excluding the active product
    //     return activeCategory.products.filter(product => product._id !== activeproduct._id);
    // };

    // useEffect(() => {
    //     const relatedProductsData = getRelatedProducts();
    //     dispatch(setrelatedProducts(relatedProductsData));
    // }, [categoriesData, activeproduct]);

    useEffect(() => {

        // Helper function to get related products.
        const getRelatedProducts = () => {
            const activeCategory = categoriesData.find(category =>
                category.products.some(product => product._id === activeproduct._id)
            );

            if (!activeCategory) return [];

            return activeCategory.products.filter(product => product._id !== activeproduct._id);
        };

        // Check if categoriesData is available or not.
        if (!categoriesData || categoriesData.length === 0) {
            const encryptedRetId = Cookies.get('retId');

            if (!encryptedRetId) {
                alert("Please enable the cookies for optimal experience of the application or refresh the page.");
                return;
            }

            const parsedEncryptedRetId = JSON.parse(encryptedRetId);

            dispatch(fetchCategories({
                id: JSON.stringify(parsedEncryptedRetId),
                page: page,
                limit: limit
            }));
        } else {
            // If categoriesData is available, then fetch the related products.
            const relatedProductsData = getRelatedProducts();
            dispatch(setrelatedProducts(relatedProductsData));
        }

    }, [categoriesData, activeproduct]);


    const relatedProductsLength = relatedProducts && Array.isArray(relatedProducts) ? relatedProducts.length : 0;

    const relatedProductsSettings = {
        dots: true,
        infinite: relatedProductsLength > 3,
        speed: 500,
        slidesToShow: Math.min(3, relatedProductsLength),
        slidesToScroll: 1
    };



    useEffect(() => {
        if (activeproduct) {
            // console.log("method hit")
            // Get the encrypted retailerId from cookies
            const encryptedRetId = JSON.parse(Cookies.get('retId'));
            // Make a request to the new route to get related products
            console.log(activeproduct, "activeproduct")
            axios.get(`${URL}/api/category/searchKit?searchTerm=${activeproduct._id}&retailerId=${JSON.stringify(encryptedRetId)}`)
                .then(response => {
                    console.log(response.data, "here are search kit")
                    dispatch(setrelatedKit(response.data))
                })
                .catch(error => {
                    console.error("Error fetching related products:", error);
                });
        }
    }, [activeproduct]);


    const relatedKitLength = relatedKit && Array.isArray(relatedKit) ? relatedKit.length : 0;

    const relatedKitSettings = {
        dots: true,
        infinite: relatedKitLength > 3,
        speed: 500,
        slidesToShow: Math.min(3, relatedKitLength),
        slidesToScroll: 1
    };


    const handleScrollToRelated = (e) => {
        e.preventDefault(); // Prevent the default behavior

        const relatedElement = document.getElementById('related');
        if (relatedElement) {
            relatedElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // console.log(relatedProducts, "relatedProducts")
    // console.log(relatedKit, "relatedKit")
    const productWidth = relatedProducts && relatedProducts.length === 1 ? '10%' : '50%'; // Adjust '20%' to your desired width for a single product

    return (
        <Box
            id="editorsetting"
            sx={{
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden', // To ensure content fits in 100vh
                padding: "10vh 0px 0px 0px"
            }}
        >
            <Box sx={{ maxWidth: "1440px", margin: 'auto' }}>

                <Grid item container>
                    <Grid item xs={12} md={7}>
                        <CustomStepper activeStep={2} steps={steps} />
                    </Grid>
                </Grid>

                <Grid container sx={{ padding: "20px" }}>
                    {currentStep === 1 && (
                        <React.Fragment>
                            <Grid sx={{ marginBottom: { xs: "60px", md: "0px" } }} item xs={12} md={4} >
                                <Typography id="editorsetting" className='nunito-b' sx={{ color: "white", fontSize: "32px" }}>
                                    Edit Colors
                                </Typography>
                                <Typography className='nunito-r' sx={{ color: "white", fontSize: "20px" }}>
                                    {selectedCategoryName ? selectedCategoryName : ""}
                                </Typography>
                                {/* old condition */}
                                {/* {
                                    paths && paths.length > 0 ? activecomponent === 1 && paths.map((item, index) => {
                                        return <PathAccordion key-={index} summary={item.id} changeLayerColor={changeLayerColor} />
                                    }) : null
                                } */}
                                {
                                    paths && paths.length > 0 ? paths.map((item, index) => {
                                        return <PathAccordion key-={index} summary={item.id} changeLayerColor={changeLayerColor} />
                                    }) : null
                                }
                            </Grid>
                        </React.Fragment>
                    )}
                    {currentStep === 2 && (
                        <React.Fragment>
                            <Grid sx={{ marginBottom: { xs: "60px", md: "0px" } }} item xs={12} md={4} >
                                <NewLogoUpload />
                            </Grid>
                        </React.Fragment>
                    )}
                    {currentStep === 3 && (
                        <React.Fragment>
                            <Grid sx={{ marginBottom: { xs: "60px", md: "0px" } }} item xs={12} md={4}>
                                <Typography className='nunito-b' sx={{ color: "white", fontSize: "32px" }}>
                                    Add Text
                                </Typography>
                                <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                                    <AddText />
                                </Box>

                            </Grid>

                        </React.Fragment>
                    )}

                    <Grid item xs={12} md={8}  >

                        <Box sx={{ mb: 3 }}>
                            <Box
                                width={matches ? "100%" : "80%"}
                                mx="auto"
                                textAlign={"center"}
                                mb={3}
                            >
                                <CanvasEditor prouctChangeTimeStamp={prouctChangeTimeStamp} setprouctChangeTimeStamp={setprouctChangeTimeStamp} deletionIndex={deletionIndex} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                            </Box>
                            {/* <Carousel3d setprouctChangeTimeStamp={setprouctChangeTimeStamp} relatedProducts={relatedProducts}   /> */}

                            {/* Grid with Slider Effect */}
                            <Slider style={{ width: '40%', margin: '0 auto' }} {...relatedProductsSettings}>
                                {
                                    relatedProducts && relatedProducts.length > 0 ? relatedProducts.map((product, index) => {
                                        const productImage = product.productImage;
                                        return (
                                            <div key={index} style={{ margin: '0 5px' }}>
                                                <Paper elevation={3} sx={{ width: productWidth, margin: '0 auto', transition: 'background-color 0.3s ease', cursor: "pointer", '&:hover': { backgroundColor: '#8C9DD3' } }}>
                                                    <Box width="100%" display="flex" justifyContent="center" alignItems="center" height={100}>
                                                        <img
                                                            onClick={() => {
                                                                dispatch(setselectedDesignId(""))
                                                                dispatch(setactiveproduct({ _id: product._id, linkfront: product.linkfront, linkback: product.linkback, name: product.name }));
                                                                setprouctChangeTimeStamp(true)
                                                            }}
                                                            style={{ maxWidth: "100%", height: "100%" }}
                                                            src={productImage}
                                                        />
                                                    </Box>
                                                </Paper>
                                            </div>
                                        );
                                    }) : null
                                }
                            </Slider>




                        </Box>
                    </Grid>
                    <Grid item xs={12} mt={3} sx={{ textAlign: "center", cursor: "pointer" }}>
                        <a onClick={handleScrollToRelated} style={{ textDecoration: "none" }}>
                            <img className="animatedScroll" src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693307156/userUploads/Group_255_fbvxp4.png"} />
                            <Typography className='nunito-r animatedScroll' sx={{ color: "white" }}>Scroll Down</Typography>
                        </a>

                    </Grid>
                </Grid>

                {/* <Grid container padding={4}>
                    <Grid item xs={12} md={6}>
                        <Typography className='nunito-b' mt={3} sx={{ fontSize: "32px", color: "white" }}>Information</Typography>
                        <Typography className='nunito-r' mt={3} sx={{ fontSize: "20px", color: "white" }}>Made from light weight and moisture wicking fabric, our polos are great for travelling, playing or supporting in.</Typography>
                        <Typography className='nunito-r' mt={3} sx={{ fontSize: "20px", color: "white" }}>Chest pockets can be added. Unlimited designs and colours. Free logos, names and numbers.</Typography>
                        <Typography className='nunito-r' mt={3} sx={{ fontSize: "20px", color: "white" }}>Chest pockets can be added. Unlimited designs and colours. Free logos, names and numbers.</Typography>
                        <Typography className='nunito-r' mt={3} sx={{ fontSize: "20px", color: "white" }}>Sizes: Mens, Womens, Kids</Typography>

                        <Typography className='nunito-b' mt={3} sx={{ fontSize: "32px", color: "white" }}>Collar & Pocket options</Typography>
                 
                        <img style={{ marginTop: "20px", width: "100%", height: "auto", maxWidth: "284px" }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693307776/userUploads/Group_256_gvnoey.png"} />
                    </Grid>
                    <Grid item xs={12} md={6} textAlign={"center"}>
                        <img style={{ width: "100%", height: "auto", maxWidth: "500px" }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693308018/userUploads/Group_258_kbcr2c.png"} />
                    </Grid>
                </Grid> */}

                <Grid container padding={4}>
                    <Grid item xs={12} md={6}>
                        <Typography className='nunito-b' mt={3} sx={{ fontSize: "32px", color: "white" }}>Information</Typography>

                        {/* Display description or default message */}
                        {description ? (
                            <Typography className='nunito-r' mt={3} sx={{ fontSize: "20px", color: "white" }}>{description}</Typography>
                        ) : (
                            <Typography variant="h5" className='nunito-b' sx={{ color: "white" }}>No Options Provided!</Typography>
                        )}

                        <Typography className='nunito-b' mt={3} sx={{ fontSize: "32px", color: "white" }}>Options</Typography>

                        {/* Display the first image from imageGallery or a default image */}
                        {
                            imageGallery && imageGallery.length > 0 ? <img
                                style={{ marginTop: "20px", width: "100%", height: "auto", maxWidth: "284px" }}
                                src={imageGallery && imageGallery.length > 0 ? imageGallery[0] : "https://res.cloudinary.com/da60naxj0/image/upload/v1693307776/userUploads/Group_256_gvnoey.png"}
                            /> : <Typography variant="h5" className='nunito-b' sx={{ color: "white" }}>No Options Provided!</Typography>
                        }
                    </Grid>

                    <Grid item xs={12} md={6} textAlign={"center"}>
                        {/* Display videoLink image or a default image */}
                        {
                            videoLink ? <img
                                style={{ width: "100%", height: "auto", maxWidth: "500px" }}
                                src={videoLink ? videoLink : "https://res.cloudinary.com/da60naxj0/image/upload/v1693308018/userUploads/Group_258_kbcr2c.png"}
                            /> : null
                        }

                    </Grid>
                </Grid>


                <Box
                    mt={4}
                    padding={4}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        // flexDirection: { xs: 'column', lg: 'row' },
                        gap: { xs: 2, lg: 0 }  // Add gap for vertical spacing in smaller screens 
                    }}
                >
                    <CustomButton
                        className="nunito-b"
                        backgroundColor="#960909"
                        fontColor="white"
                        hoverColor="white"
                        hoverFontColor="#960909"
                        borderRadius="30px"
                        border="2px solid #960909"
                        width={"185px"}
                        height={"42px"}
                        onClick={prevStep}
                    >
                        Previous
                    </CustomButton>
                    <CustomButton
                        className="nunito-b"
                        backgroundColor="#960909"
                        fontColor="white"
                        hoverColor="white"
                        hoverFontColor="#960909"
                        borderRadius="30px"
                        border="2px solid #960909"
                        width={"185px"}
                        height={"42px"}
                        onClick={nextStep}
                    >
                        Next
                    </CustomButton>
                </Box>
            </Box>
            <Box id="related" sx={{ background: "#E6EDFA", padding: "20px 0px", margin: "auto", width: "100%" }}>
                <Typography className='nunito-b' sx={{ color: "#545454", fontSize: "32px", width: "96%", margin: "auto", marginTop: "40px" }}>Related Kit</Typography>

                <Slider style={{ width: '70%', margin: '0 auto' }} {...relatedKitSettings}>
                    {
                        relatedKit && relatedKit.length > 0 ? (
                            relatedKit.map((kit, index) => (
                                <Grid key={index} sx={{ padding: "0px 2%", margin: { xs: "10px auto 10px auto", md: "" } }} item xs={12} sm={4} md={3}>
                                    <Box sx={{ background: "#FFFFFF", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                        <img onClick={() => {
                                            dispatch(setselectedDesignId(""))
                                            dispatch(setactiveproduct({ _id: kit._id, linkfront: kit.linkfront, linkback: kit.linkback, name: kit.name }));
                                            setprouctChangeTimeStamp(true)
                                        }}
                                            style={{
                                                width: "100%",
                                                height: "200px", // Set a fixed height here
                                                objectFit: "cover", // This will make sure the image covers the entire container
                                                maxWidth: "200px",
                                                margin: "auto",
                                                cursor: "pointer"
                                            }}
                                            src={kit.productImage} />
                                        <Typography className='nunito-b'>{kit.name}</Typography>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Typography className='nunito-b' sx={{ color: "white", textAlign: "center", width: "100%" }}>
                                No related kit found.
                            </Typography>
                        )
                    }
                </Slider>


                {/* <Grid container mt={1} width="100%" margin="40px auto 0px auto">
                    {items.map((item, index) => (
                        <Grid sx={{ padding: "0px 2%", margin: { xs: "10px auto 10px auto", md: "" } }} key={index} item xs={12} sm={4} md={3}>
                            <Box sx={{ background: "#FFFFFF", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                                <img style={{ width: "100%", height: "auto", maxWidth: "200px", margin: "auto" }} src={item.image} />
                                <Typography className='nunito-b'>{item.label}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid> */}

            </Box>

            <Box className="nunito-r" sx={{ background: "#011C69", padding: "30px 0px", textAlign: "center", color: "white" }}>
                Copyrights © 2023. All rights reserved
            </Box>
        </Box>
    )
}

export default Editor