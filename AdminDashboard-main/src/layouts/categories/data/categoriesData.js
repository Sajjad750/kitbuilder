
// KitBuilder Dashboard React components
import MDTypography from "components/MDTypography";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
// Images
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import { fetchCategories } from "features/cartegoriesData/categoriesSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCategory } from "features/cartegoriesData/categoriesSlice";
import { setisCategoryEdit } from "features/cartegoriesData/categoriesSlice";
import { setactiveCategory } from "features/cartegoriesData/categoriesSlice";
import { fetchCatData } from "features/cartegoriesData/categoriesSlice";
import { setmenuItems } from "features/cartegoriesData/categoriesSlice";


export default function data() {

  const {categories,activeCategory} = useSelector((state) => state.categories);
  const {isAuthenticated} = useSelector((state) => state.admin);
  const request = useSelector(state => state.confirmationModal.request)
  const isLoading = useSelector((state) => state.retailers.isLoading);
  const error = useSelector((state) => state.retailers.error);
  const [id,setId] = useState("")
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchCategories(isAuthenticated));
  //   dispatch(fetchCatData(isAuthenticated))
  // }, [dispatch]);


  // const createMenuItems = (dataset) => {
  //   const parents = dataset.filter(item => !item.parent);
  
  //   const extractChildren = (parent) => {
  //     console.log("extracting children for parent", parent._id);
  //     const children = dataset
  //       .filter(item => item.parent === parent._id)
  //       .map(child => ({
  //         label: child.name,
  //         value: child._id,
  //         children: extractChildren(child)
  //       }));
  //     console.log("children for parent", parent._id, children);
  //     return children.length > 0 ? children : null;
  //   };
    
  //   const menuItemsData = parents.map(parent => ({
  //     label: parent.name,
  //     value: parent._id,
  //     children: extractChildren(parent)
  //   }));
  
  //   dispatch(setmenuItems(menuItemsData));
  // };

  // function traverseArrayOfObjects(arr) {
  //   return arr.reduce((acc, obj) => {
  //     const newObj = {};
  //     newObj.name = obj.name;
  //     newObj._id = obj._id;
  //     if (obj.children) {
  //       newObj.children = traverseArrayOfObjects(obj.children);
  //     }
  //     acc.push(newObj);
  //     console.log(acc,"traversed")
  //     return acc;
  //   }, []);
  // }
  
  
  
  


  // useEffect(()=>{
  //   if(categories.length > 0){
  //     // console.log(categories,"menuitems")
  //    const resultant =  traverseArrayOfObjects(categories)
  //    dispatch(setmenuItems(resultant));
  //   }
  // },[categories])


  // Delete Category
  const handleDeleteCategory = (categoryId) => {
    setId(categoryId)
    dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Delete this Category?",request:{state:false,action:"deletecategory"}}))    
  };


  useEffect(()=>{
    if(request.state && request.action === "deletecategory"){
      dispatch(deleteCategory({id,isAuthenticated}));
      dispatch(setRequest({state:false,action:""}));
      setId("")
    }
  },[request])

  // Update Category Data 

  const handleCategoriesChange = (categoryId,category)=>{
    dispatch(setisCategoryEdit({active:true,currentId:categoryId}))
    dispatch(setactiveCategory(category))
    // console.log("Hnadle Chnage edit category")
    // setId(categoryId)
    // dispatch(openCon({title:"Approval Confirmation!",message:"Are you sure you want to Update this Category?",request:{state:false,action:"updatecategory"}}))    
  }

  const rowsData =Array.isArray(categories) && categories.length > 0  ? categories.map(data => ({
    name: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.name}
      </MDTypography>
    ),
    applied: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.createdAt}
      </MDTypography>
    )
    ,details: (
      <MDTypography onClick={()=>{
        dispatch(setisCategoryEdit({active:false,currentId:""}))
        dispatch(setactiveCategory([data]))
      }
      } component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        View Details
      </MDTypography>
    )      
    ,
    action: (
      <MDTypography onClick={()=>{
        dispatch(setactiveCategory([]))
        handleCategoriesChange(data._id,data)
      }} component="a" sx={{cursor:"pointer",'&:hover': {
        color: "dodgerBlue",
     }}}  variant="caption" color="text" fontWeight="medium">
        Edit Category
      </MDTypography>
    )
    ,
    delete: (
      <MDTypography  onClick={()=>{
        handleDeleteCategory(data._id)
      }} component="a" >
        <DeleteIcon  sx={{cursor:"pointer",'&:hover': {
        color: "red",
     }}} /> 
      </MDTypography>
    )
  })):[];

return {
  columns: [
    // { Header: "author", accessor: "author", width: "45%", align: "left" },
    { Header: "name", accessor: "name", align: "left" },
    { Header: "applied", accessor: "applied", align: "left" },
    { Header: "details", accessor: "details", align: "left" },
    { Header: "action", accessor: "action", align: "left" },
    { Header: "delete", accessor: "delete", align: "left" },
  ],
  rows: rowsData
};
  
}
