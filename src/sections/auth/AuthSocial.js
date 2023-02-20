// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// component
import {Google} from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large"  variant="outlined" startIcon={<Google/>} />
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
