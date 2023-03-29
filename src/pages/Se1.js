import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';


import toast from '../utils/toast';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';

export default function Se1() {
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
      typeRestriction: 'SE1',
      type: 'soft',
      min: 0,
      teamsSelected: [],
      intp: 0,
      penalty: 70
    })

    const validationSchema = Yup.object().shape({
      intp: Yup.number()
      .typeError(t('fieldRequired'))
      .test('is-number', t('fieldisNumber'), (value) => !value || !isNaN(value))
      .min(0, t('fieldMinValue'))
      .required(t('fieldRequired')),
      min: Yup.number()
      .typeError(t('fieldRequired'))
      .test('is-number', t('fieldisNumber'), (value) => !value || !isNaN(value))
      .min(0, t('fieldMinValue'))
      .required(t('fieldRequired')),
      teamsSelected: Yup.array().min(1, t('fieldRequired'))
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
      const leagueId = currentLeague.id;
      const {min,penalty, type} = values;
      const mode = "SLOTS";
    
    
      await api.post('/se1', {min, mode, type, leagueId, teamForm,penalty});
      navigate(`/dashboard/restrictions`);
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
    }
    catch(e) {
      toast({
        type: 'error',
        text: t('toastError')
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
        information={t('descriptionSE1')}
      />
    </>
  )
}