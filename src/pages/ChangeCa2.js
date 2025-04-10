import { useEffect , useState, useContext } from 'react';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { delay } from '../utils/formatTime';

import {put,get} from '../services/requests';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {LeagueContext} from '../hooks/useContextLeague';

import toast from '../utils/toast'
import Loader from '../components/Loader';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'},
  {id: 'HA', title: 'Home/Away'}
];
export default function ChangeCa2() {

  const {id} = useParams();
  const navigate = useNavigate();
  const {setValueStatusSolution} = useContext(LeagueContext);
  const [values, setValues] = useState(
    {
      typeRestriction: 'CA1',
      min:0,
      max: 0,
      mode: 'H',
      mode2: 'GLOBAL',
      type: 'soft',
      teamsSelected: [],
      teams2Selected: [],
      slots: [],
      penalty: 70
    });

    const validationSchema = Yup.object().shape({
      min: Yup.number()
      .typeError('O campo "Min" é obrigatório')
      .test('is-number', 'O campo "Min" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Min" é 0')
      .required('O campo "Min" é obrigatório'),
      max: Yup.number()
      .typeError('O campo "Max" é obrigatório')
      .test('is-number', 'O campo "Max" deve ser um número', (value) => !value || !isNaN(value))
      .min(0, 'O valor mínimo para "Max" é 0')
      .required('O campo "Max" é obrigatório'),
      teamsSelected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      teams2Selected: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Teams"'),
      slots: Yup.array().min(1, 'Selecione pelo menos um intervalo de tempo')
    });

    const [oldSlotsIds, setOldSlotsIds] = useState([]);
    const [oldTeamsIds, setOldTeamsIds] = useState([]);
    const [oldTeams2Ids, setOldTeams2Ids] = useState([]);

  const [isLoading, setIsLoading] = useState(true)
  const {t} = useTranslation();
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)

        const ca2Response = await get(`/ca2/${id}`);
        const ca2Slots = await get(`/ca2_slots/${id}`);

        const newSlots = ca2Slots.map((ca2) => ca2);
        const newSlotsIds = ca2Slots.map((ca2) => ca2.id);

        const ca2Teams = await get(`/ca2_teams/${id}`);
        const newTeams = ca2Teams.map((ca2) => ca2);
        const newTeamsIds = ca2Teams.map((ca2) => ca2.id);

        const ca2Teams2 = await get(`/ca2_teams_2/${id}`);
        const newTeams2 = ca2Teams2.map((ca2) => ca2);

        const newTeams2Ids = ca2Teams2.map((ca2) => ca2.id);

        setValues({
          typeRestriction: 'CA2',
          min: ca2Response.min,
          max: ca2Response.max,
          type: ca2Response.type,
          mode: ca2Response.mode1,
          mode2: 'GLOBAL',
          teamsSelected: newTeams,
          teams2Selected: newTeams2,
          slots: newSlots,
          penalty: ca2Response.penalty
        })
        setOldTeamsIds(newTeamsIds);
        setOldTeams2Ids(newTeams2Ids);
        setOldSlotsIds(newSlotsIds)
      } catch(e) {
        setIsLoading(false)
      } finally {
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

    try {
      setIsLoading(true);
      await delay(400)
      const teamForm = handleValueInArray(values.teamsSelected, 'id' );
      const teamForm2 = handleValueInArray(values.teams2Selected, 'id' );
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {min,max, penalty, mode,mode2, type} = values;
      await put(`/ca2/${id}`, {
        min,
        max,
        mode,
        mode2,
        type,
        leagueId,
        teamForm,
        teamForm2,
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
        text: 'Houve um erro durante a atualizaçãso'
      })
    } finally {
      setIsLoading(false)
    }
    
    
  }
  return (
    <>
      <Loader isLoading={isLoading}/>
      { 
        Boolean(oldTeamsIds.length)  && 
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