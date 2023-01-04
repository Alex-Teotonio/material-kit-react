import {Alert, Snackbar } from '@mui/material';
import propTypes from 'prop-types'

export default function ToastMessage({open, onHandleClose, message, severity}) {
  return (
    <Snackbar
    open={open}
    onClose={onHandleClose}
    message={message}
    autoHideDuration={3000}
  >
     <Alert onClose={onHandleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
  </Snackbar>
  )
}

ToastMessage.propTypes = {
  open: propTypes.bool,
  onHandleClose: propTypes.func,
  message: propTypes.string,
  severity: propTypes.string
}