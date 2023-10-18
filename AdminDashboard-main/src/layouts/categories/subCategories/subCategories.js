import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteSubCategory } from 'features/cartegoriesData/categoriesSlice';
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import { setactiveCategory } from 'features/cartegoriesData/categoriesSlice';
import FormDialog from '../subCategoryUpdate/subcategoryDataUpdate';
import { setformModal } from 'features/cartegoriesData/categoriesSlice';
import { setactiveCategoryData } from 'features/cartegoriesData/categoriesSlice';

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);
  const [catId,setcatId] = React.useState("")
  const [subCatId,setsubCatId] = React.useState("")
  const {activeCategory} = useSelector((state) => state.categories);
  const request = useSelector(state => state.confirmationModal.request)
  const {isAuthenticated} = useSelector(state => state.admin)
  const dispatch = useDispatch()

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(()=>{
    console.log(activeCategory,"active category",typeof activeCategory)
    return () => {
      dispatch(setactiveCategory([]))
    };
  },[activeCategory])



//   console.log(activeCategory,"activeCategory")

  const handleDeleteSubCategory = (categoryId,subId)=>{
    setcatId(categoryId)
    setsubCatId(subId)
    dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Delete this SubCategory?",request:{state:false,action:"deletesubcategory"}})) 
  }

  React.useEffect(()=>{
    if(request.state && request.action === "deletesubcategory"){
      dispatch(deleteSubCategory({catId,subCatId,isAuthenticated}));
      dispatch(setactiveCategory([]))
      dispatch(setRequest({state:false,action:""}));
      setcatId("")
      setsubCatId("")
    }
  },[request])




  return (
    <div>
      <FormDialog />
    {
      activeCategory && activeCategory.map((category)=>{
        return(
          <>
      <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
            <TextField
              id="category-name"
              value={category.name}
              label="Category Name"
              variant="outlined"
              fullWidth
              disabled
            />
            </Grid>
{/* 
            <Grid item xs={12} md={6}>
              <TextField
              value={category.urlslug}
                type="text"
                id="url-slug"
                label="URL Slug"
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
              value={category.position}
                type="number"
                id="position"
                label="Position"
                variant="outlined"
                fullWidth
                disabled
              />
            </Grid> */}
            {
              category.parent?.name ? <>
                <Grid item xs={12} md={6}>
            <TextField
                  value={category.parent.name ? category.parent.name : "Not Assigned"}
                    type="text"
                    id="parent"
                    label="Parent Category"
                    variant="outlined"
                    fullWidth
                    disabled
                  />  
            </Grid>
              </>: null
            }
            <Grid item xs={12}>
              <img src={category.image} style={{width:"100px",height:"90px"}} />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={<Checkbox checked={category.isActive} />}
                label="Active"
              />
            </Grid>
            <Grid container mt={4} ml={3}>
            <Grid item xs={6}>
              &nbsp;&nbsp;&nbsp;
              <button onClick={()=> dispatch(setactiveCategory([]))} style={{backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}>Cancel</button>
            </Grid>
            </Grid>
          </Grid>
          </Box>    
          </>
        )
      })
    }

    </div>
  );
}
