import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
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
  {id: 'HA', title: 'Home/Away'},
];


export default function Se1() {const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(
    {
      typeRestriction: 'SE1',
      type: 'soft',
      min: 0,
      teamsSelected: [],
      intp: 0,
      penalty: 70
    })

    const validationSchema = Yup.object().shape({
      intp: Yup.number()
      .typeError('Defina a quantidade de jogos consecutivos')
      .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
      .required('O campo "Jogos consecutivos" é obrigatório'),
      min: Yup.number()
      .typeError('Defina um valor para o campo acima')
      .test('is-number', 'O campo "Min" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Min" é 0')
      .required('O campo "Min" é obrigatório'),
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"')
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
      const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const leagueId = currentLeague.id;
      const {min,penalty, type} = values;
      const mode = "SLOTS";
    
    
      await api.post('/se1', {min, mode, type, leagueId, teamForm,penalty,teamPublicId});
      navigate(`/dashboard/restrictions`);
    }
    catch(e) {
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