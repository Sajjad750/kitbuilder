
// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
// Images
import team2 from "assets/images/team-2.jpg";
import { updateRetailerStatus } from "features/retailersData/retailersSlice";
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import { fetchProducts } from "features/productsData/productsSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProduct } from "features/productsData/productsSlice";
import { setactiveProduct } from "features/productsData/productsSlice";
import { updateproduct } from "features/productsData/productsSlice";
import { setisProductEdit } from "features/productsData/productsSlice";

export default function data() {

  const {products,isProductEdit} = useSelector((state) => state.products);
  const {isAuthenticated} = useSelector((state) => state.admin);
  const request = useSelector(state => state.confirmationModal.request)
  const isLoading = useSelector((state) => state.retailers.isLoading);
  const error = useSelector((state) => state.products.error);
  const [id,setId] = useState("")
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchProducts());
  // }, [dispatch]);

  const handleDeleteProduct = (productId) => {
    setId(productId)
    dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Delete this Product?",request:{state:false,action:"deleteproduct"}}))    
  };

  useEffect(()=>{
    if(request.state && request.action === "deleteproduct"){
      dispatch(deleteProduct({id,isAuthenticated}));
      dispatch(setactiveProduct([]))
      dispatch(setRequest({state:false,action:""}));
      setId("")
    }
  },[request])

  const handleProductChange = (productId,product)=>{
    dispatch(setisProductEdit({active:true,currentId:productId}))
    dispatch(setactiveProduct(product))
    // console.log("Hnadle Chnage edit category")
    // setId(categoryId)
    // dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Update this Category?",request:{state:false,action:"updatecategory"}}))    
  }

  console.log(products,"products")

  const Author = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  
  const rowsData =Array.isArray(products) && products.length > 0  ? products.map(data => ({
    author: <Author image={data.productImage} name={data.name} />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={data.status ? "Active" : "Pending"} color={data.status ? "success" : "dark"} variant="gradient" size="sm" />
      </MDBox>
    ),
    // applied: (
    //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //     {data.createdAt}
    //   </MDTypography>
    // ),
    details: (
      <MDTypography onClick={()=>{ 
        dispatch(setisProductEdit({active:false,currentId:""}))
        dispatch(setactiveProduct([data]))
      }} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        View Details
      </MDTypography>
    ),        
    action: (
      <MDTypography onClick={()=>{ 
        dispatch(setactiveProduct([]))
        handleProductChange(data._id,data)
        // dispatch(setisProductEdit({active:true,currentId:data._id}))
       }} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        Edit Product
      </MDTypography>
    ),
    delete: (
      <MDTypography  onClick={()=>{
        handleDeleteProduct(data._id)
      }} component="a" >
        <DeleteIcon  sx={{cursor:"pointer",'&:hover': {
        color: "red",
     }}} /> 
      </MDTypography>
    )
  })):[];

return {
  columns: [
    { Header: "author", accessor: "author", width: "45%", align: "left" },
    { Header: "details", accessor: "details", align: "left" },
    { Header: "action", accessor: "action", align: "left" },
    { Header: "delete", accessor: "delete", align: "left" },
  ],
  rows: rowsData
};
  
}
