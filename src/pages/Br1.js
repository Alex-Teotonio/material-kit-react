import { useState } from 'react';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'},
  {id: 'HA', title: 'Home/Away'},
];


export default function Br1() {
  const [values, setValues] = useState(
    {
      typeRestriction: 'Br1',
      type: 'soft',
      teamsSelected: [],
      slots: [],  
      intp: 0,
      mode: 'H',
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
    const teamForm = handleValueInArray(values.teamsSelected, 'id' );
    const slotForm = handleValueInArray(values.slots, 'id' );
    const leagueId = currentLeague.id;
    const {intp, mode,penalty, type} = values;
    
    await api.post('/br1', {intp, mode, type, leagueId, teamForm,slotForm, penalty,slotPublicId,teamPublicId});
    
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