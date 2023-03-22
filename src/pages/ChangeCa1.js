import { useEffect, useState, useContext } from 'react';
import * as Yup from 'yup';
import {Container} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom';
import {get, put} from '../services/requests'
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import Loader from '../components/Loader';
import { delay } from '../utils/formatTime';
import toast from '../utils/toast'
import {LeagueContext} from '../hooks/useContextLeague';

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
  const {setValueStatusSolution} = useContext(LeagueContext);
  const validationSchema = Yup.object().shape({
    max: Yup.number()
    .typeError('O campo "Max" é obrigatório')
    .test('is-number', 'O campo "Max" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Max" é 0')
    .required('O campo "Max" é obrigatório'),
    teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
    slots: Yup.array().min(1, 'Selecione pelo menos um intervalo de tempo')
  });
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
        oldTeamsIds,
        oldSlotsIds
      });
      setValueStatusSolution('outdated');
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
          validationSchema={validationSchema}
        />
        </Container>
      }
    </>
  )
}