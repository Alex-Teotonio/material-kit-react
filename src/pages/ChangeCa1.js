import { useEffect, useState } from 'react';
import {Container} from '@mui/material'
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


export default function ChangeCa1() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA1',
      max: 0,
      type: 'soft',
      mode: 'H',
      teamsSelected: [],
      slots: [],
      penalty: 70
    });
    const [isLoading, setIsLoading] = useState(true)

    const [oldSlotsIds, setOldSlotsIds] = useState([]);
    const [oldTeamsIds, setOldTeamsIds] = useState([])

    useEffect(() => {
      (async () => {
        try{
          setIsLoading(true);
          const ca1Response = await get(`/ca1/${id}`);
      
          const ca1Slots = await get(`/ca1_slots/${id}`);
          const newSlots = ca1Slots.map((ca1) => ca1);
          const newSlotsIds = ca1Slots.map((ca1) => ca1.id);
      
          const ca1Teams = await get(`/ca1_teams/${id}`);
          const newTeams = ca1Teams.map((ca1) => ca1);
          const newTeamsIds = ca1Teams.map((ca1) => ca1.id);
          setValues(
            {
              typeRestriction: 'CA1',
              max: ca1Response.max,
              type: ca1Response.type,
              mode: ca1Response.mode,
              teamsSelected: newTeams,
              slots: newSlots,
              penalty: ca1Response.penalty
              
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
      const slotPublicId = handleValueInArray(values.slots, 'publicid' );
      const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {max, penalty, mode, type} = values;
      await put(`/ca1/${id}`, {
        max,
        mode,
        type,
        leagueId,
        teamForm,
        slotForm,
        penalty,
        slotPublicId,
        teamPublicId,
        oldTeamsIds,
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
  return (
    <>
      <Loader isLoading={isLoading}/>
      { 
        Boolean(oldSlotsIds.length)  &&
        <Container maxWidth="xl" fixed>
        <FormRestrictions 
          initialValues={values}
          handleChangeValues={handleChangeInput}
          handleChangeMultipleValues={handleChangeTeams}
          itemsRadioType={itemsRadioType}
          itemsRadioMode={itemsRadioMode}
          onHandleSubmit={handleSubmitValue}
        />
        </Container>
      }
    </>
  )
}