import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {get, put} from '../services/requests';
import toast from '../utils/toast';

import Loader from '../components/Loader';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'},
  {id: 'HA', title: 'Home/Away'},
];


export default function ChangeBr1() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'Br1',
      type: 'soft',
      teamsSelected: [],
      slots: [],  
      intp: 0,
      mode: 'H',
      mode2: 'HA',
      penalty: 70
    })

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [oldSlotsIds, setOldSlotsIds] = useState([]);
  const [oldTeamsIds, setOldTeamsIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    (async () => {
      try{
        setIsLoading(true);
        const br1Response = await get(`/br1/${id}`);
    
        const br1Slots = await get(`/br1_slots/${id}`);
        const newSlots = br1Slots.map((br1) => br1);
        const newSlotsIds = br1Slots.map((br1) => br1.id);
    
        const br1Teams = await get(`/br1_teams/${id}`);
        const newTeams = br1Teams.map((br1) => br1);
        const newTeamsIds = br1Teams.map((br1) => br1.id);
        setValues(
          {
            typeRestriction: 'BR1',
            max: br1Response.max,
            type: br1Response.type,
            intp: 0,
            mode: br1Response.mode2,
            teamsSelected: newTeams,
            slots: newSlots,
            penalty: br1Response.penalty
            
          }
        )
        setOldSlotsIds(newSlotsIds)
        setOldTeamsIds(newTeamsIds);
      }catch {
        setIsLoading(false)
      }
      finally {
        setIsLoading(false)
      }
    })();
  }, []);


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
    
    try
    {
      setIsLoading(true)
      const slotPublicId = handleValueInArray(values.slots, 'publicid' );
      const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {intp, mode,penalty, type} = values;
    
     await put(`/br1/${id}`, {intp, mode, type, leagueId, teamForm,slotForm, penalty,slotPublicId,teamPublicId, oldSlotsIds,oldTeamsIds});

     toast({
      type: 'success',
      text: 'Restrição atualizada com sucesso'
    })
    navigate(`/dashboard/restrictions`)
    } catch {
      setIsLoading(false)
      toast({
        type: 'error',
        text: 'Houve um erro durante a operação'
      })
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <>
    <Loader isLoading = {isLoading}/>
      { Boolean(oldSlotsIds.length) &&
        <FormRestrictions 
          initialValues={values}
          handleChangeValues={handleChangeInput}
          handleChangeMultipleValues={handleChangeTeams}
          itemsRadioType={itemsRadioType}
          itemsRadioMode={itemsRadioMode}
          onHandleSubmit={handleSubmitValue}
        />
      }
    </>
  )
}