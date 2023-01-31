import { PropTypes } from 'prop-types';
import {Button, Stack} from '@mui/material';
import {DoubleArrow} from '@mui/icons-material';

export default function Utilities({children}) {

  return (

      <Stack direction='row'>
        {children}
        <Button startIcon={<DoubleArrow/>}>Todos</Button>
      </Stack>
  )

}

Utilities.propTypes = {
  children: PropTypes.node
}