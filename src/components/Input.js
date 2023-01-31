import {TextField} from '@mui/material';
import propTypes from 'prop-types'

export default function Input(props) {
   const {label, name, value, onChange, type} = props;


   return (
    <TextField
      value={value}
      onChange={onChange}
      name={name}
      label={label}
      type={type}
      InputLabelProps={{
        shrink: true,
      }}
    />
   )
}

Input.propTypes = {
  label: propTypes.string,
  name: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
  type: propTypes.string
}

Input.defaultProps = {
  type:'string'
}