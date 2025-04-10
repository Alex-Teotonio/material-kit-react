import { useEffect, useState, useContext } from 'react';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import {get, put} from '../services/requests'
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {LeagueContext}  from '../hooks/useContextLeague';
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
  const {setValueStatusSolution} = useContext(LeagueContext);
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

  const validationSchema = Yup.object().shape({
    max: Yup.number()
    .typeError('Campo Max é obrigatório')
    .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
    .required('O campo "Jogos consecutivos" é obrigatório'),
    teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
    slots: Yup.array().min(1, 'Defina ao menos um intervalo de tempo'),
    teams2Selected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
  });


  const handleValueInArray = (data, campo) => data.map((d) => d[campo])

  const handleSubmitValue = async () =>{

    try {
      setIsLoading(true);
      await delay(400)
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
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
        oldTeamsIds,
        oldTeams2Ids,
        oldSlotsIds
      }, currentLeague.id);
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
        (Boolean(oldTeams2Ids.length) && 
          <FormRestrictions 
            initialValues={values}
            handleChangeValues={handleChangeInput}
            handleChangeMultipleValues={handleChangeTeams}
            itemsRadioType={itemsRadioType}
            itemsRadioMode={itemsRadioMode}
            onHandleSubmit={handleSubmitValue}
            validationSchema={validationSchema}
          />
        )
      }
    </>
  )
}