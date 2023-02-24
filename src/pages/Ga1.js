import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import {post} from '../services/requests'
import FormGa1 from '../components/Ga1Restrictions/FormGa1';
import {delay} from '../utils/formatTime'
import toast from '../utils/toast'

const itemsRadioType = [
  {id: 'hard', title: 'Hard'},
  {id: 'soft', title: 'Soft'}
];
export default function Ga1() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(
    {
      typeRestriction: 'GA1',
      min: 0,
      max: 0,
      type: 'soft',
      teamsSelected: [],
      teams2Selected: [],
      slots: [],
      penalty: 70,
      gameId: 0
    })

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const handleChangeInput = (name, value) => {
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleGames = (game) => {
    setValues({
      ...values,
      gameId: game
    })
  }

  const handleChangeTeams = (name, value) => {

    setValues({
      ...values,
      [name]: value
    })
  }
  const handleSubmitValue = async () =>{
    try{
      setIsLoading(true);
      await delay(400);
      const slotId = values.slots
      const leagueId = currentLeague.id;
      const {gameId,min,max, penalty, type} = values;
      

      const game_id = gameId
      await post('/ga1', {
        min,
        max,
        type,
        slotId,
        leagueId,
        penalty,
        game_id
      });
      toast({
        type: 'success',
        text: 'Restrição cadastrada com sucesso'
      })
      navigate(`/dashboard/restrictions`)
    } catch(e) {
      toast({
        type: 'error',
        text: 'Houve um erro durante a operação'
      })
    } finally {
      setIsLoading(false);
    }
    
  }

  return (
    <>
    <Loader isLoading={isLoading}/>
      <FormGa1 
        initialValues={values}
        handleChangeValues={handleChangeInput}
        itemsRadioType={itemsRadioType}
        handleChangeMultipleValues={handleChangeTeams}
        onHandleSubmit={handleSubmitValue}
        onHandleGames={handleGames}
      />
    </>
  )
}