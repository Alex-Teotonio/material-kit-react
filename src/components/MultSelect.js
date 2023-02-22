import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import propTypes from 'prop-types'

export default function MultSelect({
  dataMultSelect,
  labelMultSelect,
  placeholderMultSelect,
  onHandleChange,
  marginTopString,
  valueMultSelect,
  name,
  disabled,
  error,
  messageError
}) {

  return (
    <Stack spacing={3} sx={{ width: 500, marginTop: marginTopString}}>
      <Autocomplete
        multiple
        value={valueMultSelect}
        name={name}
        disabled={disabled}
        id="tags-outlined"
        onChange={(e, newTeamValue) => {
          onHandleChange(e, newTeamValue, name);
        }}
        options={dataMultSelect}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label={labelMultSelect} error={error} helperText={error? messageError: ''} placeholder={placeholderMultSelect} />
        )}
        error={error}
        helperText={messageError}
      />
    </Stack>
  );
}

MultSelect.propTypes = {
  dataMultSelect: propTypes.array.isRequired,
  labelMultSelect: propTypes.string.isRequired,
  placeholderMultSelect: propTypes.string.isRequired,
  onHandleChange: propTypes.func.isRequired,
  marginTopString: propTypes.string,
  name: propTypes.string.isRequired,
  valueMultSelect: propTypes.array.isRequired,
  disabled: propTypes.bool,
  error: propTypes.bool.isRequired,
  messageError: propTypes.string.isRequired
}

MultSelect.defaultProps = {
  marginTopString: '8px',
  disabled: false
}