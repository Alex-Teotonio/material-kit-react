import { PropTypes } from 'prop-types';
import {Button, Stack} from '@mui/material';
import {DoubleArrow} from '@mui/icons-material';

export default function Utilities({onHandleClick,name, children}) {

  return (

      <Stack direction='row' spacing={2} alignItems="center" sx={{width: '500px'}}>
        {children}
        <Button variant="outlined" onClick={() => onHandleClick(name)} sx={{height: '55px'}}startIcon={<DoubleArrow/>}>Todos</Button>
      </Stack>
  )

}

Utilities.propTypes = {
  children: PropTypes.node.isRequired,
  onHandleClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}