import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
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
  const {t} = useTranslation();
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
      games: []
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

  const handleChangeTeams = (e, value, name) => {
    setValues({
      ...values,
      [name]: value
    })
  }
  
  const handleValueInArray = (data, campo) => data.map((d) => d[campo]);
  const handleSubmitValue = async () =>{
    try{
      setIsLoading(true);
      await delay(400);
      const slotForm = handleValueInArray(values.slots, 'id' );
      const leagueId = currentLeague.id;
      const {games,min,max, penalty, type} = values;
      


      const game_id = games
      console.log(game_id)
      await post('/ga1', {
        min,
        max,
        type,
        slotForm,
        leagueId,
        penalty,
        game_id
      });
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
      navigate(`/dashboard/restrictions`)
    } catch(e) {
      toast({
        type: 'error',
        text: t('toastError')
      })
    } finally {
      setIsLoading(false);
    }    
  }

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
      .when('min', (min, schema) => schema.test({
          test: (value) => value >= min,
          message: 'O campo "Max" deve ser maior ou igual ao campo "Min"',
        }))
      .required('O campo "Max" é obrigatório'),
    games: Yup.array().min(1, 'Selecione pelo menos uma equipe para "Games"'),
    slots: Yup.array().min(1, 'Selecione pelo menos um intervalo de tempo'),
  });
  
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
        validationSchema={validationSchema}
        information={t('descriptionGA1')}
      />
    </>
  )
}