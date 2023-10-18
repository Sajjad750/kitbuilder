import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

const products = [
  { id: 1, name: 'Product 1', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 2, name: 'Product 2', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 3, name: 'Product 3', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 2, name: 'Product 2', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 3, name: 'Product 3', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 2, name: 'Product 2', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 3, name: 'Product 3', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  { id: 2, name: 'Product 2', image: 'https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png' },
  // ... Add as many products as needed
];


function ProductGrid() {
    return (
      <Box sx={{ paddingTop: 4}}> {/* Adjust margin here */}
        <Grid container spacing={2}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography className='nunito-b' sx={{color:"#545454",textAlign:"center"}} variant="h6">{product.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  
export default ProductGrid;
