import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {get, put} from '../services/requests';
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


export default function ChangeCa3() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA3',
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
    const [isLoading, setIsLoading] = useState(true);

    const [oldTeamsIds, setOldTeamsIds] = useState([])
    const [oldTeams2Ids, setOldTeams2Ids] = useState([])

    useEffect(() => {
      (async () => {
        try{
          setIsLoading(true);
          const ca3Response = await get(`/ca3/${id}`);
      
          const ca3Teams = await get(`/ca3_teams1/${id}`);
          const newTeams = ca3Teams.map((ca1) => ca1);
          const newTeamsIds = ca3Teams.map((ca1) => ca1.id);

          const ca3Teams2 = await get(`/ca3_teams2/${id}`);
          const newTeams2 = ca3Teams2.map((ca1) => ca1);
          const newTeams2Ids = ca3Teams2.map((ca1) => ca1.id);
          setValues(
            {
              typeRestriction: 'CA3',
              max: ca3Response.max,
              type: ca3Response.type,
              mode: ca3Response.mode1,
              mode2: ca3Response.mode2,
              intp: ca3Response.intp,
              teamsSelected: newTeams,
              teams2Selected: newTeams2,
              penalty: ca3Response.penalty
              
            }
          )
          setOldTeamsIds(newTeamsIds);
          setOldTeams2Ids(newTeams2Ids)
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
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      teams2Selected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
    });

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
      const team2Form = handleValueInArray(values.teams2Selected, 'id' );
      const leagueId = currentLeague.id;
      const {intp,max, penalty, mode,mode2, type} = values;
      await put(`/ca3/${id}`, {
        max,
        mode,
        intp,
        mode2,
        type,
        leagueId,
        teamForm,
        team2Form,
        penalty,
        oldTeamsIds,
        oldTeams2Ids
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
        (Boolean(oldTeamsIds.length) && 
          <FormRestrictions 
            initialValues={values}
            handleChangeValues={handleChangeInput}
            handleChangeMultipleValues={handleChangeTeams}
            itemsRadioType={itemsRadioType}
            itemsRadioMode={itemsRadioMode}
            onHandleSubmit={handleSubmitValue}
            labelButton="Salvar Alterações"
            validationSchema={validationSchema}
          />
        )
      }
    </>
  )
}