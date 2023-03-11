import { useContext } from 'react';
import { Stack, Button, Divider, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from 'react-router-dom';
import {createUser, auth as authBD} from '../../services/requests';
import { LeagueContext } from '../../hooks/useContextLeague';
import api from '../../services/api'


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG7F0I6CGr02IKdTvL4CukE8qqcPkfDrk",
  authDomain: "goal-ufop.firebaseapp.com",
  projectId: "goal-ufop",
  storageBucket: "goal-ufop.appspot.com",
  messagingSenderId: "287482310008",
  appId: "1:287482310008:web:8110f9f0a5c8ac6d42ac8d",
  measurementId: "G-3BXDY6MZYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const defaultPassword = "senhaPadrao123"; // senha padrão definida

export default function AuthSocial() {

  const {handleLogin} = useContext(LeagueContext);
  const navigate = useNavigate()
  const handleGoogleLogin = async() => {
    try {
      // Obtém as credenciais de autenticação do Google
      const result = await signInWithPopup(auth, provider);

      const { displayName, email } = result.user;
      const [firstName, lastName] = displayName.split(' ');

      const {data: user} = await api.get(`/user/${email}`);

      
      // Se o usuário não existe, cria um novo usuário no banco de dados
      if (!user.email) {
        const {data} = await createUser(firstName, lastName, defaultPassword, email);
        handleLogin(data.email, defaultPassword)
        navigate('/dashboard/app', { replace: true });
      }

      await handleLogin(email,defaultPassword);
      navigate('/dashboard/app', { replace: true });

      // handle successful login
    } catch (error) {
      navigate('/login');
      console.log(error);
    }
  };

  return (
    <>
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" variant="outlined" startIcon={<Google />} onClick={handleGoogleLogin}>Continue with Google</Button>
      </Stack>
    </>
  );
}


// Id cliente OAUTH -> 287482310008-dhife1jpu1urbbhjc6o4g5ufv1th2qdt.apps.googleusercontent.com