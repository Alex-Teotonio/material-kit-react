import { useEffect , useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { delay } from '../utils/formatTime';

import {put,get} from '../services/requests';
import FormRestrictions from '../components/BasicRestrictions/FormRestrictions';
import {LeagueContext} from '../hooks/useContextLeague';
import api from '../services/api';

import toast from '../utils/toast'
import Loader from '../components/Loader';


const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];

const itemsRadioMode = [
  {id: 'H', title: 'Home'},
  {id: 'A', title: 'Away'}
];
export default function ChangeCa2() {

  const {id} = useParams();
  const navigate = useNavigate();
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
      const slotPublicId = handleValueInArray(values.slots, 'publicid' );
      const teamPublicId = handleValueInArray(values.teamsSelected, 'publicid' );
      const team2PublicId = handleValueInArray(values.teams2Selected, 'publicid' );
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
        />
      }
    </>
  )
}