
// KitBuilder Dashboard React components
import MDTypography from "components/MDTypography";
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from "react";
// Images
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import { fetchCategories } from "features/cartegoriesData/categoriesSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreIcon from '@mui/icons-material/More';
// import { deleteCategory } from "features/cartegoriesData/categoriesSlice";
// import { setisCategoryEdit } from "features/cartegoriesData/categoriesSlice";
// import { setactiveCategory } from "features/cartegoriesData/categoriesSlice";
import { fetchQuotesData } from "features/adminData/adminSlice";
import { deleteQuoteData } from "features/adminData/adminSlice";
import { Link, useNavigate } from "react-router-dom";
import { setcurrentQuote } from "features/adminData/adminSlice";
import { setselectedTicket } from "features/ticketsData/ticketsSlice";
import { seterrornull } from "features/adminData/adminSlice";
import { setMessage } from "features/adminData/adminSlice";


export default function data() {

  const {categories,activeCategory} = useSelector((state) => state.categories);
  const {isAuthenticated,quotesData,error,message} = useSelector((state) => state.admin);
  const request = useSelector(state => state.confirmationModal.request)
  const [id,setId] = useState("")
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchQuotesData(isAuthenticated));
  // }, [dispatch]);

  useEffect(() => {
    if(isAuthenticated){
      dispatch(fetchQuotesData(isAuthenticated));
    }
  }, [isAuthenticated]);


  // Delete Category
  const handleDeleteQuote = (categoryId) => {
    setId(categoryId)
    dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Delete this Quote?",request:{state:false,action:"deletequote"}}))    
  };


  useEffect(()=>{
    if(request.state && request.action === "deletequote"){
      dispatch(deleteQuoteData({id,isAuthenticated}));
      dispatch(setRequest({state:false,action:""}));
      setId("")
    }
  },[request])

  useEffect(() => {
    if (error) {
      alert("Error: " + error);
      dispatch(seterrornull())
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      alert("Success: " + message);
      dispatch(setMessage(null));
    }
  }, [message]);


  console.log(quotesData,"quotesData")



  const rowsData =Array.isArray(quotesData) && quotesData.length > 0  ? quotesData.map(data => ({
    Name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.firstName+" "+data.lastName}
      </MDTypography>
    ),
    Contact: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.phoneNumber}
      </MDTypography>
    ),
    Email: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.email}
      </MDTypography>
    ),
    Company: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.companyName}
      </MDTypography>
    ),
    Country: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.countryName}
      </MDTypography>
    ),
    City: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.cityName}
      </MDTypography>
    ),
    RegionName: (
      <MDTypography  variant="caption" color="text" fontWeight="medium">
        {data.regionName}
      </MDTypography>
    )
    ,
    Details: (
      <MDTypography onClick={()=>{
        dispatch(setcurrentQuote(data))
      }} component={Link} to='/quotesdetails'>
      <MoreIcon sx={{cursor:"pointer", '&:hover': {color: "red"}}} /> 
    </MDTypography>
    )
    ,
    Delete: (
      <MDTypography  onClick={()=>{
        handleDeleteQuote(data._id)
      }} component="a" >
        <DeleteIcon  sx={{cursor:"pointer",'&:hover': {
        color: "red",
     }}} /> 
      </MDTypography>
    )
  })):[];

return {
  columns: [
    { Header: "Name", accessor: "Name", align: "left" },
    { Header: "Contact", accessor: "Contact", align: "left" },
    { Header: "Email", accessor: "Email", align: "left" },
    { Header: "Company", accessor: "Company", align: "left" },
    { Header: "Country", accessor: "Country", align: "left" },
    { Header: "City", accessor: "City", align: "left" },
    { Header: "RegionName", accessor: "RegionName", align: "left" },
    { Header: "Details", accessor: "Details", align: "left" },
    { Header: "Delete", accessor: "Delete", align: "left" },
  ],
  rows: rowsData
};
  
}