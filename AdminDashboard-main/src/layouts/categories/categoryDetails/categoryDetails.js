import { Box,Grid, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import './categoryDetails.css'
import { useDispatch } from "react-redux";
import { setactiveCategory } from "features/cartegoriesData/categoriesSlice";
import ControlledAccordions from "../subCategories/subCategories";
const CategoryDetailsPage = () => {
    const dispatch = useDispatch()

  return (
    <>
        <Box mt={3} mb={3}  sx={{padding:"10px",width:"100%",borderRadius:"10px",boxShadow:"2px 2px 2px 2px"}}>
            <Grid container>
                <Grid item xs={6}>
                <Typography className='mfeb' sx={{ textAlign: "left",padding:"10px" }} component="h1" variant="h5">
                View Category Details
                </Typography>
                </Grid> 
                <Grid item xs={6} >
                    <Box sx={{padding:"10px",textAlign:"right"}}>
                    <CancelIcon onClick={()=> dispatch(setactiveCategory([]))} sx={{color:"#3891EE",cursor:"pointer"}} />
                    </Box>      
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}  mt={4} sx={{}}>
                    <Box sx={{marginTop:"14px"}}>
                        <ControlledAccordions />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </>
  );
};

export default CategoryDetailsPage;
