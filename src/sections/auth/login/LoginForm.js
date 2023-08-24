import * as Yup from 'yup';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// form Login
import {Login} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { AppBar, Toolbar,Link, Stack, IconButton, InputAdornment, Typography } from '@mui/material';

import { LoadingButton } from '@mui/lab';
// components
import { delay } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

import {LeagueContext} from '../../../hooks/useContextLeague'

// import {auth} from '../../../services/requests'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [objectMessage, setObjectMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const {handleLogin} = useContext(LeagueContext);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {

    try{
        await handleLogin(methods.getValues('email'),methods.getValues('password'))
        await delay(500)
        navigate('/dashboard/app', { replace: true });
      } catch(error) {
        console.log(error)
        delay(500)
        navigate('/login')
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFTextField name="email" label="Email address" />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <RHFCheckbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton 
          endIcon={<Login/>}
          fullWidth
          size="large"
          type='submit'
          variant="contained"
          onClick={() => setOpen(true)}
          loading={isSubmitting}
        >
          <Typography variant='subtitle'>Login</Typography>
        </LoadingButton>
      </FormProvider>
      </>
  );
}
