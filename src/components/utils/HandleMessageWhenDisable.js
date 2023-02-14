import {forwardRef} from 'react';
import PropTypes from 'prop-types'
import {Tooltip} from '@mui/material';

export default function HandleMessageWhenDisable({children, isDisable}) {
  if(isDisable) { 
  return (
      <Tooltip title="You don't have permission to do this">
        <div>{children}</div>
      </Tooltip>
  );
  } 
    return (
      children
    )
  
}

HandleMessageWhenDisable.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  isDisable: PropTypes.bool.isRequired
}