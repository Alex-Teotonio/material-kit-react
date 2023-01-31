import React from 'react';
import { PropTypes } from 'prop-types';
import { FormControl, FormLabel, RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function RadioGroup(props) {

    const { name, label, value, onChange, items } = props;

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <MuiRadioGroup row
              name={name}
              value={value}
              label={label}
              onChange={onChange}
            >
              {
                  items.map(
                      item => (
                          <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                      )
                  )
              }
            </MuiRadioGroup>
        </FormControl>
    )
}

RadioGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  items: PropTypes.object

}