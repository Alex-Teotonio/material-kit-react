import {TextField} from '@mui/material';
import PropTypes from 'prop-types'

export default function Input(props) {
   const {label, name, value, onChange, type, disabled, error, messageError, widthProp} = props;
   return (
    <TextField
      value={value}
      onChange={onChange}
      name={name}
      label={label}
      type={type}
      disabled={disabled}
      sx={{width: widthProp}}
      InputLabelProps={{
        shrink: true,
      }}
      error={error}
      helperText = {error && messageError}
    />
   )
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool.isRequired,
  messageError: PropTypes.string,
  widthProp: PropTypes.string
}

Input.defaultProps = {
  type:'string',
  disabled: false,
  widthProp: '500px',
  messageError: ''
}