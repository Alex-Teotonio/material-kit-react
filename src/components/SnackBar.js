import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export default function CustomizedSnackbars({open, message, severity, onHandleClose}) {

  React.useEffect(() => {
  },[message])


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onHandleClose()
  };
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

CustomizedSnackbars.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.string,
  onHandleClose: PropTypes.func
}