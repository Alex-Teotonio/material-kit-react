import { useState, useEffect } from 'react';
import {useTranslation} from 'react-i18next'
import { Button, Stack } from '@mui/material';
import LinearProgress  from '../components/LinearProgress';
import Iconify from '../components/Iconify';
import api from '../services/api';

import {delay} from '../utils/formatTime'

export default function Result() {

  const [file, setFile] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const {t} = useTranslation(); 

  useEffect(() => {
    async function generateXmlInput(){
      await api.get(`/archive/${currentLeague.id}`);

    }

    generateXmlInput()
  }
  ,[])


  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const handleResult = async () => {
    try{
    setIsLoading(true)
    await delay(500);
      const response = await api.get(`/result/${currentLeague.id}`)
      setFile((response.data))
    }catch(e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
    <Stack direction="row" alignContent="center" alignItems="center" spacing={2}>
      <LinearProgress isLoading={isLoading}/>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        sx={{height: '30px',width: '20%'}}
        onClick={handleResult}
      >
        Gerar
      </Button>
    </Stack>

    <div>{(file)}</div>
    </>
  )

}