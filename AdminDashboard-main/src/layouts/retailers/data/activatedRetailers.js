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
import { fetchActivatedNotDisabledRetailers, updateActivatedNotDisabledRetailers } from "features/retailersData/retailersSlice";
export default function data() {
  const retailers = useSelector((state) => state.retailers.retailers);
  const request = useSelector(state => state.confirmationModal.request)
  const isLoading = useSelector((state) => state.retailers.isLoading);
  const error = useSelector((state) => state.retailers.error);
  const { isAuthenticated } = useSelector(state => state.admin)
  const [deletionId, setdeletionId] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const activatedNotDisabled = useSelector((state) => state.retailers.activatedNotDisabled);

  const handleRetailerDelete = (retailerId) => {
    setdeletionId(retailerId)
    dispatch(openCon({ title: "Deletion Confirmation!", message: "Are you sure you want to Delete this Retailer?", request: { state: false, action: "deleteretailer" } }))
  };

  useEffect(() => {
    if (request.state && request.action === "deleteretailer") {
      dispatch(deleteRetailer({ deletionId, isAuthenticated }));
      dispatch(setRequest({ state: false, action: "" }));
      setdeletionId("")
    }
  }, [request])

  const handleCopy = () => {
    alert("Feed Code Copied!")
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

  const rowsData = Array.isArray(activatedNotDisabled) && activatedNotDisabled.length > 0 ? activatedNotDisabled.map(data => ({
    author: <Author image={team2} name={data.name} email={data.email} />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent={"Active"} color={"success"} variant="gradient" size="sm" />
      </MDBox>
    ),
    Feedcode: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        <CopyToClipboard text={data.feedCode} onCopy={handleCopy}>
          <MDBadge sx={{ cursor: "pointer" }} badgeContent={"Copy Feedcode"} color={"info"} variant="gradient" size="sm" />
        </CopyToClipboard>
      </MDTypography>
    ),
    member: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {data.createdAt}
      </MDTypography>
    ),
    Disable: (
      <MDTypography onClick={() => {
        dispatch(updateActivatedNotDisabledRetailers({ id: data._id, isActivated: false, isAuthenticated: isAuthenticated }))
      }} sx={{
        cursor: "pointer", '&:hover': {
          color: "red",
        }
      }} variant="caption" color="text" fontWeight="medium">
        Disable Retailer
      </MDTypography>
    )
  })) : [];

  return {
    columns: [
        { Header: "author", accessor: "author", width: "45%", align: "left" },
        { Header: "status", accessor: "status", align: "left" },
        { Header: "Feedcode", accessor: "Feedcode", align: "left" },
        { Header: "member", accessor: "member", align: "left" },
        { Header: "Disable", accessor: "Disable", align: "left" }
    ],
    rows: rowsData
};
}