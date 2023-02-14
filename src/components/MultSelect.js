import { useState } from 'react';
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
  disabled
}) {
  const [value,] = useState();
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
          <TextField {...params} label={labelMultSelect} placeholder={placeholderMultSelect} />
        )}
      />
    </Stack>
  );
}

MultSelect.propTypes = {
  dataMultSelect: propTypes.array,
  labelMultSelect: propTypes.string,
  placeholderMultSelect: propTypes.string,
  onHandleChange: propTypes.func,
  marginTopString: propTypes.string,
  name: propTypes.string,
  valueMultSelect: propTypes.array,
  disabled: propTypes.bool
}