import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';

import toast from '../utils/toast';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';

export default function Ca3() {
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA3',
      max: 0,
      type: 'soft',
      mode: 'H',
      teamsSelected: [],
      teams2Selected: [],
      intp: 0,
      penalty: 70
    })

    const validationSchema = Yup.object().shape({
      intp: Yup.number()
      .typeError('Defina a quantidade de jogos consecutivos')
      .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
      .required('O campo "Jogos consecutivos" é obrigatório'),
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      teams2Selected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
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
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
      const leagueId = currentLeague.id;
      const mode2 = 'SLOTS';
      const {max,intp, penalty, mode, type} = values;
      
      await api.post('/ca3', {max, mode,intp, mode2, type, leagueId, teamForm,team2Form, penalty});

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
        information={t('descriptionCA3')}
      />
    </>
  )
}