import { useState } from 'react';
import {useTranslation} from 'react-i18next'
import { Button, Stack } from '@mui/material';
import LinearProgress  from '../components/LinearProgress';
import Iconify from '../components/Iconify';
import api from '../services/api'

export default function Result() {

  const [file, setFile] = useState('')
  const {t} = useTranslation();


  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const handleResult = async () => {
    const response = await api.get(`/archive/${currentLeague.id}`);
    setFile((response.data))
  }
  return (
    <>
    <Stack direction="row" alignContent="center" alignItems="center" spacing={2}>
      <LinearProgress/>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        sx={{height: '30px',width: '20%'}}
        onClick={handleResult}
      >
        Gerar
      </Button>
    </Stack>

    <div>{file}</div>
    </>
  )

}