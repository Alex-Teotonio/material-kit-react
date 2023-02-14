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


export default function Se1() {
  const [values, setValues] = useState(
    {
      typeRestriction: 'Se1',
      type: 'soft',
      min: 0,
      teamsSelected: [],
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
    const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
    const teamForm = handleValueInArray(values.teamsSelected, 'id' );
    const leagueId = currentLeague.id;
    const {min,penalty, type} = values;
    const mode = "SLOTS";
    
    await api.post('/se1', {min, mode, type, leagueId, teamForm,penalty,teamPublicId});
    
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