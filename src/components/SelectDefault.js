import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import propTypes from 'prop-types'

export default function SelectLabels({dataSelect, onHandleChange, label, name}) {

  return (
    <div>
      <FormControl sx={{ minWidth: 500 }}>
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          label={label}
          onChange={(e) => onHandleChange(e,name)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            dataSelect.map((data) => (
              <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </div>
  );
}

SelectLabels.propTypes = {
  dataSelect: propTypes.array,
  onHandleChange: propTypes.func,
  label: propTypes.string,
  name: propTypes.string
}