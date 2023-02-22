import {TextField} from '@mui/material';
import propTypes from 'prop-types'

export default function Input(props) {
   const {label, name, value, onChange, type, disabled, error, messageError} = props;
   return (
    <TextField
      value={value}
      onChange={onChange}
      name={name}
      label={label}
      type={type}
      disabled={disabled}
      sx={{width: '250px'}}
      InputLabelProps={{
        shrink: true,
      }}
      error={error}
      helperText = {messageError}
    />
   )
}

Input.propTypes = {
  label: propTypes.string,
  name: propTypes.string,
  value: propTypes.number.isRequired,
  onChange: propTypes.func,
  type: propTypes.string,
  disabled: propTypes.bool,
  error: propTypes.bool.isRequired,
  messageError: propTypes.string.isRequired
}

Input.defaultProps = {
  type:'string',
  disabled: false
}