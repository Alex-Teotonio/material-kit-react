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


export default function ChangeBr2() {
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
        const br2 = await get(`/br2/${id}`);
    
        const br2Slots = await get(`/br2_slots/${id}`);
        const newSlots = br2Slots.map((br1) => br1);
        const newSlotsIds = br2Slots.map((br1) => br1.id);
    
        const br2Teams = await get(`/br2_teams/${id}`);
        const newTeams = br2Teams.map((br2) => br2);
        const newTeamsIds = br2Teams.map((br2) => br2.id);
        setValues(
          {
            typeRestriction: 'BR2',
            max: br2.max,
            type: br2.type,
            mode: br2.homemode,
            intp: 0,
            teamsSelected: newTeams,
            slots: newSlots,
            penalty: br2.penalty
            
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
      const {intp,mode,penalty, type} = values;
      const homeMode = mode;
     await put(`/br2/${id}`, {
      intp,
      mode,
      homeMode,
      type,
      leagueId,
      teamForm,
      slotForm,
      penalty,
      slotPublicId,
      teamPublicId,
      oldSlotsIds,
      oldTeamsIds});

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