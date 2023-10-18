import { Box, Checkbox, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import MarkunreadIcon from '@mui/icons-material/Markunread';
// import InsertLinkIcon from '@mui/icons-material/InsertLink';
// import PrintIcon from '@mui/icons-material/Print';

// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CustomButton from '../../components/customButton/customButton';
import { Link, useNavigate } from 'react-router-dom';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { setActiveProducts, setactiveDesign } from '../../redux/userData/userdataSlice';
import { setdesignsData, setselectedDesignId, settriggerCanvas } from '../../redux/canvasData/canvasData';
import { useDispatch, useSelector } from 'react-redux';
import SimpleDialogMenu from '../../components/dialogueBox/DialogueBox';




const SavedDesigns = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692704621/userUploads/index_hdcvd0.png";
    const matches = useMediaQuery('(max-width:500px)');

    const { primary, secondary, sidecolor, activeDesign,activeProducts } = useSelector((state) => state.userdata)
    const { designsData } = useSelector((state) => state.canvas)
    const [open, setOpen] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    // Check if designsData exists and is an array before accessing its length


    const handleCheckboxChange = (product) => {
        if (selectedProducts.includes(product)) {
            setSelectedProducts(prev => prev.filter(p => p !== product));
        } else {
            setSelectedProducts(prev => [...prev, product]);
        }
    };

    useEffect(() => {
        console.log(selectedProducts,"selectedProducts")
      dispatch(setActiveProducts(selectedProducts))
    }, [selectedProducts])

    console.log(activeProducts,"activeProducts")
    

    
    

    const designsLength = designsData && Array.isArray(designsData) ? designsData.length : 0;

    const settings = {
        dots: true,
        infinite: designsLength > 3,
        speed: 500,
        slidesToShow: Math.min(3, designsLength),
        slidesToScroll: 1
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        getDesigns()
    }, []);

    const getDesigns = () => {
        const savedDesigns = JSON.parse(localStorage.getItem('designs')) || [];
        console.log(savedDesigns, "savedDesigns")
        dispatch(setdesignsData(savedDesigns))
    }

    useEffect(() => {
        dispatch(setactiveDesign(null))
    }, [])

    const deleteDesign = (designId) => {
        const designs = JSON.parse(localStorage.getItem('designs')) || [];
        // Find the index of the design with the provided ID
        const designIndex = designs.findIndex((design) => design.id === designId);
        if (designIndex !== -1) {
            // Remove the design from the array
            designs.splice(designIndex, 1);
            // Update the localStorage with the updated designs array
            localStorage.setItem('designs', JSON.stringify(designs));
            dispatch(setselectedDesignId(""))
            dispatch(setactiveDesign(null))
            getDesigns()
            console.log(`Design with ID ${designId} deleted.`);
        } else {
            console.log(`Design with ID ${designId} not found.`);
        }
    };

    function shareDesign(media) {
        console.log(activeDesign, "activeDesign activeDesign")
        if (activeDesign) {
            const frontDesign = activeDesign.front.designPreview;
            const backDesign = activeDesign.back && activeDesign.back.designPreview;

            if (media === "fb") {
                // Facebook (Unfortunately, Facebook doesn't support sharing multiple URLs, 
                // so we'll share the front design URL and mention the back design URL in the description)
                const description = backDesign ? `Also, check out the back design here: ${backDesign}` : "";
                let facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(frontDesign)}&description=${encodeURIComponent(description)}`;
                window.open(facebookUrl, "_blank");
            } else if (media === "wapp") {
                // WhatsApp
                let text = "Check out my custom design! Front: " + frontDesign;
                if (backDesign) {
                    text += " | Back: " + backDesign;
                }
                let whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, "_blank");
            } else if (media === "linkedin") {
                // LinkedIn (Again, LinkedIn is focused around single URLs, so we'll share the front design URL and 
                // mention the back design URL in the description)
                let title = "Check out my custom design!";
                let summary = `Front design: ${frontDesign}` + (backDesign ? `. Back design: ${backDesign}` : "");
                let linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(frontDesign)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=kitbuilder`;
                window.open(linkedinUrl, "_blank");
            }
        } else {
            alert("Please select a design first")
        }
    }


    function emailDesign() {
        if (!activeDesign) {
            alert("Please select a Design First")
        } else {
            let subject = encodeURIComponent("Check out my custom design!");
            let body = encodeURIComponent(`Here are the links to my design: 
    Front: ${activeDesign.front.designPreview} 
    Back: ${activeDesign.back.designPreview}`);
            window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        }
    }


    function printDesign() {
        if (activeDesign) {
            let printWindow = window.open('', '_blank');

            // Wait for the new window to be ready
            printWindow.onload = function () {
                // Introduce a delay before appending content
                setTimeout(() => {
                    // Create the content for the new window
                    let doc = printWindow.document;
                    if (activeDesign.front && activeDesign.front.designPreview) {
                        // Add the front design to the new window's document
                        let frontImg = doc.createElement("img");
                        frontImg.src = activeDesign.front.designPreview;
                        frontImg.style.display = "block";
                        frontImg.style.width = "100%";
                        frontImg.style.pageBreakAfter = "always"; // This ensures the back side starts on a new printed page
                        doc.body.appendChild(frontImg);

                    }

                    // Add the back design to the new window's document, if it exists
                    if (activeDesign.back && activeDesign.back.designPreview) {
                        let backImg = doc.createElement("img");
                        backImg.src = activeDesign.back.designPreview;
                        backImg.style.display = "block";
                        backImg.style.width = "100%";
                        doc.body.appendChild(backImg);
                    }

                    // Print the new window's content
                    printWindow.print();
                }, 1500); // 500ms delay, you can adjust this value as needed
            };

            // Trigger the load event for browsers that might not do it for an empty window
            printWindow.document.dispatchEvent(new Event('load'));

        } else {
            alert("Please select a design first");
        }
    }


    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'auto', // To ensure content fits in 100vh
                padding: "5vh 5vh",
                boxSizing: 'border-box', // Include padding in height
                height: '100vh' // Set height to 100vh
            }}
        >
            <SimpleDialogMenu open={open} setOpen={setOpen} activeDesign={activeDesign} />
            <Box sx={{ maxWidth: "1440px", margin: 'auto' }}>

                <Grid container sx={{ marginTop: "40px" }}>
                    <Grid item xs={12} md={4}>
                        <Link to="/editor">
                            <Box
                                onClick={() => {
                                    dispatch(settriggerCanvas(true))
                                }}
                                sx={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    background: "#334985",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer"
                                }}>
                                <ArrowBackIcon style={{ fill: 'white' }} />
                            </Box>
                        </Link>
                        <Typography className='nunito-b' mt={5} sx={{ fontSize: "32px", color: "white" }}>Your Final Design</Typography>
                        <Typography className='nunito-r' sx={{ fontSize: "18px", color: "white" }}>Plz select design if you want to share</Typography>
                        <Box sx={{ display: 'flex', gap: 2, marginTop: "20px" }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: "pointer" }}>
                                <img onClick={() => {
                                    emailDesign()
                                }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693890067/userUploads/Group_14_xzhpau.png"} />
                                <Typography className='nunito-r' variant="caption" style={{ color: 'white' }}>Email</Typography>
                            </Box>

                            <Box onClick={() => {
                                if (!activeDesign) {
                                    alert("Please select a Design First")
                                } else {
                                    setOpen(true)
                                    // copyToClipboard(activeDesign.front.designPreview, activeDesign.back.designPreview)
                                }
                            }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: "pointer" }}>
                                <img src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693890067/userUploads/Group_15_e6ke7x.png"} />
                                <Typography className='nunito-r' variant="caption" style={{ color: 'white' }}>Copy Link</Typography>
                            </Box>

                            <Box onClick={() => {
                                printDesign()
                            }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: "pointer" }}>
                                <img src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693890067/userUploads/Group_261_ypgsgi.png"} />
                                <Typography className='nunito-r' variant="caption" style={{ color: 'white' }}>Print</Typography>
                            </Box>
                        </Box>

                        <Box mt={4}>
                            <Typography className='nunito-b' sx={{ fontSize: "32px", color: "white" }}>Share on Social Media</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: "20px" }}>
                                <img style={{ cursor: "pointer" }} onClick={() => {
                                    shareDesign("fb")

                                }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693891052/userUploads/Group_13_swigwt.png"} />
                                {/* <img src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693891052/userUploads/instagram_zuegdo.png"} /> */}
                                {/* <img src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693891052/userUploads/Group_12_uicczu.png"} /> */}
                                <img style={{ cursor: "pointer" }} onClick={() => {
                                    shareDesign("linkedin")
                                }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693891052/userUploads/Group_11_izmomk.png"} />
                            </Box>
                        </Box>
                        <Box
                            mt={4}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: 'column', lg: 'row' },
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
                                onClick={() => {
                                    if (selectedProducts.length > 0) {
                                        navigate('/requestquote')
                                    } else {
                                        alert("Please select the design first!")
                                    }
                                }}
                            >
                                Request a Quote
                            </CustomButton>
                            <Link to="/choosekit">
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
                                    onClick={() => console.log('Button clicked!')}
                                >
                                    Design Another Kit
                                </CustomButton>
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8} sx={{ marginTop: { xs: "30px", md: "0px" } }}>
                        <Box sx={{ mb: 3 }}>
                            {/* Transparent Full-Width Box */}
                            <Box
                                width={matches ? "100%" : "80%"}
                                bgcolor="rgba(130, 148, 203, 0.5)" // This sets the color #8294CB with 50% transparency
                                mx="auto"
                                textAlign={"center"}
                                mb={3}
                                padding={{ xs: "0px", md: "10px" }}
                                overflow="hidden" // This ensures that child elements don't overflow the boundaries of the Box
                            >
                                {
                                    activeDesign ?
                                        <img
                                            alt="previewimg"
                                            style={{
                                                width: "100%",
                                                maxWidth: "304px",
                                                maxHeight: "100%", // Ensure the image doesn't exceed the height of the Box
                                                objectFit: "contain" // Ensure the image scales down while maintaining its aspect ratio
                                            }}
                                            src={activeDesign.front?.designPreview || activeDesign.back?.designPreview}
                                        />
                                        :
                                        <Typography sx={{ padding: "20px 0px", color: "white" }}>Please select design</Typography>
                                }
                            </Box>

                            <Slider style={{ width: '70%', margin: '0 auto' }} {...settings}>
                                {
                                    designsData && designsData.length > 0 ? designsData.map((value, index) => {
                                        const designPreview = value.front?.designPreview || value.back?.designPreview;
                                        return (
                                            <div key={index} style={{ margin: '0 10px' }}>
                                                <Paper elevation={3} sx={{ width: '30%', margin: '0 auto', transition: 'background-color 0.3s ease', cursor: "pointer", '&:hover': { backgroundColor: '#8C9DD3' } }}>
                                                    <Box width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                                        <img onClick={() => {
                                                            dispatch(setactiveDesign(value))
                                                        }} style={{ maxWidth: "80%", height: "auto" }} src={designPreview} />
                                                        <Checkbox
                                                            checked={selectedProducts.includes(value)}
                                                            onChange={() => handleCheckboxChange(value)}
                                                        />
                                                    </Box>
                                                </Paper>
                                            </div>
                                        );
                                    }) : null
                                }
                            </Slider>

                            <Box
                                width={matches ? "100%" : "80%"}
                                sx={{ margin: "auto" }}>
                                <Box
                                    mt={4}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-around",
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
                                        onClick={() => {
                                            if (activeDesign) {
                                                dispatch(setselectedDesignId(activeDesign.id))
                                                navigate('/editor')
                                            } else {
                                                alert("Please select the design first!")
                                            }

                                        }}
                                    >
                                        Edit
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
                                        onClick={() => {
                                            if (activeDesign) {
                                                deleteDesign(activeDesign.id)
                                            } else {
                                                alert("Please select the design first!")
                                            }
                                        }}
                                    >
                                        Delete
                                    </CustomButton>
                                </Box>
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default SavedDesigns