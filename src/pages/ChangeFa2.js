import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {get, put} from '../services/requests';
import { delay } from '../utils/formatTime';
import toast from '../utils/toast';

import Loader from '../components/Loader';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
];


export default function ChangeFa2() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'Fa2',
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
  const [isLoading, setIsLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    intp: Yup.number()
    .typeError('Defina a quantidade de jogos consecutivos')
    .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
    .required('O campo "Jogos consecutivos" é obrigatório'),
    teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
    slots: Yup.array().min(1, 'Defina ao menos um inervalo de tempo')
  });



  useEffect(() => {
    (async () => {
      try{
        setIsLoading(true);
        await delay(400)
        const fa2Response = await get(`/fa2/${id}`);
    
        const fa2Slots = await get(`/fa2_slots/${id}`);
        const newSlots = fa2Slots.map((br1) => br1);
        const newSlotsIds = fa2Slots.map((br1) => br1.id);
    
        const fa2Teams = await get(`/fa2_teams/${id}`);
        const newTeams = fa2Teams.map((br1) => br1);
        const newTeamsIds = fa2Teams.map((br1) => br1.id);
        setValues(
          {
            typeRestriction: 'FA2',
            max: fa2Response.max,
            type: fa2Response.type,
            intp: 0,
            mode: fa2Response.mode,
            teamsSelected: newTeams,
            slots: newSlots,
            penalty: fa2Response.penalty
            
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
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {intp, mode,penalty, type} = values;
    
     await put(`/fa2/${id}`, {intp, mode, type, leagueId, teamForm,slotForm, penalty, oldSlotsIds,oldTeamsIds}, currentLeague.id);

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
          validationSchema={validationSchema}
        />
      }
    </>
  )
}