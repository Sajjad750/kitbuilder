import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const designLinkSides = ['Frontside Link', 'Backside Link'];

function SimpleDialog(props) {
  const { onClose, selectedValue, open,activeDesign } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const copyToClipboard = async (link) => {
    try {
        await navigator.clipboard.writeText(link);
        alert("Design Link Copied!");
    } catch (err) {
        alert("Something went wrong!")
    }
};

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Copy Design Links</DialogTitle>
      <List sx={{ pt: 0 }}>
        {designLinkSides.map((email,index) => (
          <ListItem disableGutters>
            <ListItemButton onClick={() => {
                if(index === 0){
                    copyToClipboard(activeDesign.front.designPreview)
                }else if(index === 1){
                    copyToClipboard(activeDesign.back.designPreview)
                }
                
            }} key={email}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <ContentCopyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogMenu({open,setOpen,activeDesign}) {
  const [selectedValue, setSelectedValue] = React.useState(designLinkSides[1]);

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      {/* <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open simple dialog
      </Button> */}
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        activeDesign={activeDesign}
      />
    </div>
  );
}
