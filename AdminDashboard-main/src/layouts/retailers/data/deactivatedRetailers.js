// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import team2 from "assets/images/team-2.jpg";
import MDBadge from "components/MDBadge";
import { useSelector, useDispatch } from 'react-redux';
import { fetchRetailers } from "features/retailersData/retailersSlice";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { openCon } from "features/confirmationModal/confirmationModal";
import { setRequest } from "features/confirmationModal/confirmationModal";
import { deleteRetailer } from "features/retailersData/retailersSlice";
import { setisRetailerProfile } from "features/retailersData/retailersSlice";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setcurrentRetailer } from "features/retailersData/retailersSlice";
import { useNavigate } from "react-router-dom";
import { updateActivatedDisabledRetailers } from "features/retailersData/retailersSlice";

export default function data() {
    const activatedDisabled = useSelector((state) => state.retailers.activatedDisabled);
    const request = useSelector(state => state.confirmationModal.request)
    const isLoading = useSelector((state) => state.retailers.isLoading);
    const error = useSelector((state) => state.retailers.error);
    const { isAuthenticated } = useSelector(state => state.admin)
    const [deletionId, setdeletionId] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleCopy = () => {
        alert("Please Activate the Retailer to Copy Feedcode!")
    };

    const Author = ({ image, name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDTypography variant="caption">{email}</MDTypography>
            </MDBox>
        </MDBox>
    );

    const rowsData = Array.isArray(activatedDisabled) && activatedDisabled.length > 0 ? activatedDisabled.map(data => ({
        author: <Author image={team2} name={data.name} email={data.email} />,
        status: (
            <MDBox ml={-1}>
                <MDBadge badgeContent={"Inactive"} color={"error"} variant="gradient" size="sm" />
            </MDBox>
        ),
        member: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {data.createdAt}
            </MDTypography>
        ),
        Feedcode: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                <CopyToClipboard text={``} onCopy={handleCopy}>
                    <MDBadge sx={{ cursor: "pointer" }} badgeContent={"Disabled"} color={"error"} variant="gradient" size="sm" />
                </CopyToClipboard>
            </MDTypography>
        ),
        Enable: (
            <MDTypography onClick={()=>{
              dispatch(updateActivatedDisabledRetailers({id:data._id,isDisabled:false,isAuthenticated:isAuthenticated}))
            }}  sx={{cursor:"pointer",'&:hover': {
              color: "dodgerBlue",
           }}}  variant="caption" color="text" fontWeight="medium">
              Enable Retailer
            </MDTypography>
          )  
    })) : [];

    return {
        columns: [
            { Header: "author", accessor: "author", width: "45%", align: "left" },
            { Header: "status", accessor: "status", align: "left" },
            { Header: "Feedcode", accessor: "Feedcode", align: "left" },
            { Header: "member", accessor: "member", align: "left" },
            { Header: "Enable", accessor: "Enable", align: "left" }
        ],
        rows: rowsData
    };
}
