import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {get, put} from '../services/requests';
import toast from '../utils/toast';
import { delay } from '../utils/formatTime';

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
        const br1Response = await get(`/se1/${id}`);
    
        const se1Teams = await get(`/se1_teams/${id}`);
        const newTeams = se1Teams.map((br1) => br1);
        const newTeamsIds = se1Teams.map((br1) => br1.id);
        setValues(
          {
            typeRestriction: 'SE1',
            min: br1Response.min,
            type: br1Response.type,
            intp: 0,
            mode: br1Response.mode1,
            teamsSelected: newTeams,
            penalty: br1Response.penalty
            
          }
        )
        setOldTeamsIds(newTeamsIds);
      }catch {
        setIsLoading(false)
      }
      finally {
        setIsLoading(false)
      }
    })();
  }, []);



  const validationSchema = Yup.object().shape({
    intp: Yup.number()
    .typeError('Defina a quantidade de jogos consecutivos')
    .test('is-number', 'O campo "Jogos consecutivos" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Jogos consecutivos" é 0')
    .required('O campo "Jogos consecutivos" é obrigatório'),
    min: Yup.number()
    .typeError('Defina um valor para o campo acima')
    .test('is-number', 'O campo "Min" deve ser um número', (value) => !value || !isNaN(value))
    .min(0, 'O valor mínimo para "Min" é 0')
    .required('O campo "Min" é obrigatório'),
    teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"')
  });


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
      setIsLoading(true);
      await delay(400)
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const leagueId = currentLeague.id;
      const {min, mode,penalty, type} = values;
    
     await put(`/se1/${id}`, {min, mode, type, leagueId,penalty, teamForm,oldTeamsIds});

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
      { Boolean(oldTeamsIds.length) &&
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