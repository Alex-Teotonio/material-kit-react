import { useState } from 'react';
import {
  Container
} from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { delay } from '../utils/formatTime';
import toast from '../utils/toast';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import Loader from '../components/Loader'

const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'}
];


export default function Ca1() {
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA1',
      max: 0,
      type: 'soft',
      mode: 'H',
      teamsSelected: [],
      slots: [],
      penalty: 70
    });
    const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    max: Yup.number()
    .typeError('O campo "Max" é obrigatório')
    .test('is-number', 'O campo "Max" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Max" é 0')
    .required('O campo "Max" é obrigatório'),
    teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
    type: Yup.string().required('Selecione uma opção para "Type"'),
    mode: Yup.string().required('Selecione uma opção para "Mode"'),
    slots: Yup.array().min(1, 'Selecione pelo menos um intervalo de tempo')
  });


  const [isLoading, setIsLoading] = useState(false)

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const handleChangeInput = (name, value) => {
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleChangeTeams = (e, newTeamValues, name) => {
    setValues({
      ...values,
      [name]: newTeamValues
    })
  }

  const handleValueInArray = (data, campo) => data.map((d) => d[campo])

  const handleSubmitValue = async () =>{

    try {
      setIsLoading(true);
      await delay(500)
      const slotPublicId = handleValueInArray(values.slots, 'publicid' );
      const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {max, penalty, mode, type} = values;
      
      await api.post('/ca1', {
        max,
        mode,
        type,
        leagueId,
        teamForm,
        slotForm,
        penalty,
        slotPublicId,
        teamPublicId
      });

      toast({
        type: 'success',
        text: 'Restrição adicionada com sucesso'
      })
      navigate(`/dashboard/restrictions`)
    } catch(e) {
      setIsLoading(false)
      toast({
        type: 'error',
        text: 'Houve um erro durante a operação'
      });
    }finally {
      setIsLoading(false)
    }
    
  }

  return (
    <>
    <Loader isLoading={isLoading}/>
    <Container maxWidth="xl" fixed>
      <FormRestrictions 
        initialValues={values}
        handleChangeValues={handleChangeInput}
        handleChangeMultipleValues={handleChangeTeams}
        itemsRadioType={itemsRadioType}
        itemsRadioMode={itemsRadioMode}
        onHandleSubmit={handleSubmitValue}
        validationSchema={validationSchema}
      />
    </Container>
    </>
  )
}