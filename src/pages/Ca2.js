import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import toast from '../utils/toast';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';

const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'},
  {id: 'HA', title: 'Home/Away'}
];


export default function Ca2() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA2',
      min:0,
      max: 0,
      type: 'soft',
      mode: 'H',
      teamsSelected: [],
      teams2Selected: [],
      slots: [],
      penalty: 70
    })

    const validationSchema = Yup.object().shape({
      min: Yup.number()
      .typeError('O campo "Min" é obrigatório')
      .test('is-number', 'O campo "Min" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Min" é 0')
      .required('O campo "Min" é obrigatório'),
      max: Yup.number()
      .typeError('O campo "Max" é obrigatório')
      .test('is-number', 'O campo "Max" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Max" é 0')
      .required('O campo "Max" é obrigatório'),
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      teams2Selected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      slots: Yup.array().min(1, 'Selecione pelo menos um intervalo de tempo')
    });
  

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
      await delay(400)
    const teamForm = handleValueInArray(values.teamsSelected, 'id' );
    const teamForm2 = handleValueInArray(values.teams2Selected, 'id' );
    const slotForm = handleValueInArray(values.slots, 'id' );
    const leagueId = currentLeague.id;
    const mode2 = 'GLOBAL';
    const {min, max, penalty, mode, type} = values;
    
    await api.post('/ca2', {
      min,
      max,
      mode,
      mode2,
      type,
      leagueId,
      teamForm,
      teamForm2,
      slotForm,
      penalty
    });
    toast({
      type: 'success',
      text: 'Restrição cadastrada com sucesso'
    })
    navigate(`/dashboard/restrictions`);
  } catch(e) {
    toast({
      type: 'error',
      text: 'Houve um erro durante a operação'
    })
  } finally {
    setIsLoading(false);
  }
    
  }

  return (
    <>
    <Loader isLoading={isLoading}/>
      <FormRestrictions 
        initialValues={values}
        handleChangeValues={handleChangeInput}
        handleChangeMultipleValues={handleChangeTeams}
        itemsRadioType={itemsRadioType}
        itemsRadioMode={itemsRadioMode}
        onHandleSubmit={handleSubmitValue}
        validationSchema={validationSchema}
      />
    </>
  )
}