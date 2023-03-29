import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import toast from '../utils/toast';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';

export default function Ca4() {
  const {t} = useTranslation();

  const itemsRadioType = [
    {id: 'hard', title: t('valueLabelTypeHard')},
    {id: 'soft', title: t('valueLabelTypeSoft')}
  ];

  const itemsRadioMode = [
    {id: 'H', title: t('valueLabelHome')},
    {id: 'A', title: t('valueLabelAway')}
  ];
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA4',
      max: 0,
      type: 'soft',
      mode: 'H',
      teamsSelected: [],
      teams2Selected: [],
      slots: [],
      penalty: 70
    });
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
      max: Yup.number()
      .typeError(t('fieldRequired'))
      .test('is-number', t('fieldisNumber'), (value) => !value || !isNaN(value))
      .min(0,t('fieldMinValue'))
      .required(t('fieldRequired')),
      teamsSelected: Yup.array().min(1, t('fieldRequired')),
      slots: Yup.array().min(1, t('fieldRequired')),
      teams2Selected: Yup.array().min(1, t('fieldRequired')),
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
      await delay(400);
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const mode2 = 'GLOBAL';
      const {max, penalty, mode, type} = values;
      
      await api.post('/ca4', {
        max,
        mode,
        mode2,
        type,
        leagueId,
        teamForm,
        team2Form,
        slotForm,
        penalty
      });
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
      navigate(`/dashboard/restrictions`);
    }  catch(e) {
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
          information={t('descriptionCA4')}
        />
    </>
  )
}