
import { Stack, Chip } from '@mui/material'
import propTypes from 'prop-types'

export default function MuiChip({color, label}){
  
  return (
    <Stack direction='row' spacing={1}>
      <Chip
        label={label}
        color={color}
      />
    </Stack>
  )
}

MuiChip.propTypes = {
  color: propTypes.string,
  label: propTypes.string
}