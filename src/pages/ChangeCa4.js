import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {get, put} from '../services/requests'
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';
import toast from '../utils/toast'


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'}
];


export default function ChangeCa4() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA4',
      max: 0,
      type: 'soft',
      intp: 0,
      mode: 'H',
      mode2: 'GLOBAL',
      teamsSelected: [],
      teams2Selected: [],
      slots: [],
      penalty: 70
    });
    const [isLoading, setIsLoading] = useState(true)
    const [oldSlotsIds, setOldSlotsIds] = useState([]);
    const [oldTeamsIds, setOldTeamsIds] = useState([])
    const [oldTeams2Ids, setOldTeams2Ids] = useState([])

    useEffect(() => {
      (async () => {
        try{
          setIsLoading(true);
          const ca4Slots = await get(`/ca4_slots/${id}`);

          const newSlots = ca4Slots.map((ca4) => ca4);
          const newSlotsIds = ca4Slots.map((ca4) => ca4.id);
          const ca4Response = await get(`/ca4/${id}`);
      
          const ca4Teams = await get(`/ca4_teams1/${id}`);
          const newTeams = ca4Teams.map((ca4) => ca4);
          const newTeamsIds = ca4Teams.map((ca4) => ca4.id);

          const ca4Teams2 = await get(`/ca4_teams2/${id}`);
          const newTeams2 = ca4Teams2.map((ca4) => ca4);
          const newTeams2Ids = ca4Teams2.map((ca4) => ca4.id);

          console.log(newTeams)
          setValues(
            {
              typeRestriction: 'CA4',
              max: ca4Response.max,
              type: ca4Response.type,
              mode: ca4Response.mode1,
              slots: newSlots,
              mode2: ca4Response.mode2,
              teamsSelected: newTeams,
              teams2Selected: newTeams2,
              penalty: ca4Response.penalty
              
            }
          )
          setOldTeamsIds(newTeamsIds);
          setOldTeams2Ids(newTeams2Ids);
          setOldSlotsIds(newSlotsIds)
        }catch {
          setIsLoading(false)
        }
        finally {
          setIsLoading(false)
        }
      })();
    }, []);

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
      const slotForm = handleValueInArray(values.slots, 'id' );
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
      const slotPublicId = handleValueInArray(values.slots, 'publicid' );
      const leagueId = currentLeague.id;
      const {max, penalty, mode,mode2, type} = values;
      await put(`/ca4/${id}`, {
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
        team2PublicId,
        oldTeamsIds,
        oldTeams2Ids,
        oldSlotsIds
      });
      toast({
        type: 'success',
        text: 'Restrição atualizada com sucesso'
      })
      navigate(`/dashboard/restrictions`)
    } catch {
      setIsLoading(false)
      toast({
        type: 'error',
        text: 'Houve um erro durante a atualização'
      })
    } finally {
      setIsLoading(false)
    }
    
    
  }
  console.log(oldTeams2Ids.length)
  return (
    <>
      <Loader isLoading={isLoading}/>
      { 
        (Boolean(oldTeams2Ids.length) && 
          <FormRestrictions 
            initialValues={values}
            handleChangeValues={handleChangeInput}
            handleChangeMultipleValues={handleChangeTeams}
            itemsRadioType={itemsRadioType}
            itemsRadioMode={itemsRadioMode}
            onHandleSubmit={handleSubmitValue}
          />
        )
      }
    </>
  )
}