import PropTypes from  'prop-types'
import SnackBar from '../SnackBar';

export function HandleSnackbar({message, open, onHandleClose}) {
   return (
    <SnackBar />
   )
}
HandleSnackbar.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
  onHandleClose: PropTypes.func
}

