import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';

import toast from '../utils/toast';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';

export default function Fa2() {

  const {t} = useTranslation();
  const itemsRadioType = [
    {id: 'hard', title: t('valueLabelTypeHard')},
    {id: 'soft', title: t('valueLabelTypeSoft')}
  ];
  
  const itemsRadioMode = [
    {id: 'H', title: t('valueLabelHome')},
    {id: 'A', title: t('valueLabelAway')},
    {id: 'HA', title: t('valueLabelHomeAway')}
  ];
  const [values, setValues] = useState(
    {
      typeRestriction: 'FA2',
      type: 'soft',
      teamsSelected: [],
      slots: [],  
      intp: 0,
      mode: 'H',
      penalty: 70
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const validationSchema = Yup.object().shape({
      intp: Yup.number()
      .typeError('Defina a quantidade de jogos consecutivos')
      .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
      .required('O campo "Jogos consecutivos" é obrigatório'),
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      slots: Yup.array().min(1, 'Defina ao menos um inervalo de tempo')
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
    const slotForm = handleValueInArray(values.slots, 'id' );
    const leagueId = currentLeague.id;
    const {intp, mode,penalty, type} = values;
    await api.post('/fa2', {intp, mode, type, leagueId, teamForm,slotForm, penalty,});
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
        information={t('descriptionFA2')}
      />
    </>
  )
}