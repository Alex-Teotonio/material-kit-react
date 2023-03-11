import * as React from 'react';
import PropTypes from 'prop-types';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Button,Box, Stack, Typography} from '@mui/material';
import {Sports, Warning, Home} from '@mui/icons-material'
import Tooltip from '@mui/material/Tooltip';

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
  {
    value: 0,
  },
  {
    value: 20,
  },
  {
    value: 37,
  },
  {
    value: 100,
  },
];

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  width: '250px',
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: 6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));
function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};

export default function CustomizedSlider({value, onChange, name}) {
  const {t} = useTranslation()
  return (
    <Tooltip 
      title="Defina o peso da penalidade."
      sx={{ 
        backgroundColor: 'gray',
        color: 'white' 
      }}
    >
      <Box 
        sx={{ 
          display:'flex',
          alignItems: 'center',
          marginTop: '24px',
          marginBottom: '10px'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px', justifyContent: 'flex-end', marginRight: '12px'}}>
          <Warning sx={{color: '#2065D1'}} />
          <Typography sx={{color: '#2065D1'}}> Penalidade</Typography>
        </Stack>
        <IOSSlider
          name={name}
          value={value}
          onChange={onChange}
          defaultValue={60}
          marks={marks}
          valueLabelDisplay="on"
        />
      </Box>
    </Tooltip>
  );
}

CustomizedSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
}