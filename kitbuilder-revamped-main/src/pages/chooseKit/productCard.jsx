import { Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPathColors } from "../../redux/userData/userdataSlice";



export const ProductCard = ({ product, onProductClick }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [clickCount, setClickCount] = useState(0);

    const dispatch = useDispatch()
    const {selectedcolors,pathColors} = useSelector((state) => state.userdata);

    useEffect(() => {
        // Fetch the SVG content from the remote link
        fetch(product.linkfront)
            .then(response => response.text())
            .then(data => {
                const svgDom = new DOMParser().parseFromString(data, 'image/svg+xml');
                
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
    }, [product.linkfront, selectedcolors]);

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