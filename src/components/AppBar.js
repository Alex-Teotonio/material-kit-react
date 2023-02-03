import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import propTypes from 'prop-types'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Info} from '@mui/icons-material'
import {Button,Toolbar, Tooltip} from '@mui/material';
import Modal from "./Modal";

export default function ButtonAppBar({titleAppBar, titleModal = '', descriptionModal}) {

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () =>{
    setIsOpen(false)
  }

  const handleOpen = () =>{
    setIsOpen(true)
  }
  return (
    <Box sx={{ flexGrow: 1 }} >
      <Modal 
        titleModal={titleModal}
        descriptionModal={descriptionModal}
        isOpen={isOpen}
        onRequestClose={handleClose}
      />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {titleAppBar}
          </Typography>
          {
          
          titleModal && <Tooltip> 
              <Button  color="inherit" onClick={handleOpen} sx={{padding: '0'}}startIcon={<Info/>}/>
          </Tooltip>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}


ButtonAppBar.propTypes = {
  titleAppBar: propTypes.string,
  titleModal: propTypes.string,
  descriptionModal: propTypes.string


}