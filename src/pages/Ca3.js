import { useState } from 'react';
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
  {id: 'HA', title: 'Home/Away'},
];


export default function Ca3() {
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
      const team2PublicId = handleValueInArray(values.teams2Selected, 'publicid' );
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
      const leagueId = currentLeague.id;
      const mode2 = 'SLOTS';
      const {max,intp, penalty, mode, type} = values;
      
      await api.post('/ca3', {max, mode,intp, mode2, type, leagueId, teamForm,team2Form, penalty,teamPublicId,team2PublicId});

      toast({
        type: 'success',
        text: 'Restrição cadastrada com sucesso'
      })
      navigate(`/dashboard/restrictions`)
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
      />
    </>
  )
}