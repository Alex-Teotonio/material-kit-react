import { useState } from 'react';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'}
];


export default function Ca4() {
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
    const slotPublicId = handleValueInArray(values.slots, 'publicid' );
    const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
    const team2PublicId = handleValueInArray(values.teams2Selected, 'publicid' );
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
      penalty,
      slotPublicId,
      teamPublicId,
      team2PublicId
    });
    
  }

  return (
    <>
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