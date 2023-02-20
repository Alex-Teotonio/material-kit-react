
import {useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect} from '@mui/material';

import { PropTypes } from 'prop-types';
import { Send,DoubleArrow} from '@mui/icons-material';
  import Loader from '../Loader'
import SliderCustom from "../Slider";
import {get} from '../../services/requests';

import Input from '../Input';
import RadioGroupCustomize from '../RadioGroupCustomize';
import AppBar from '../AppBar';
import MultipleSelectChip from '../MultSelect';

import GameModal from '../../pages/ModalGames'


import Select from '../SelectDefault'

const useStyle = makeStyles(() => ({
 root: {
  '& .MuiFormControl-root': {
    margin: '8px',

    '& .MuiFormLabel-root': {
      fontSize: '12px'
    }
  }
 }
}))

export default function FormRestrictions(props) {
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGames, setSelectedGames] = useState([]);

  const [slots, setSlots] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false)

  const {
    initialValues,
    handleChangeValues,
    itemsRadioType,
    handleChangeMultipleValues,
    onHandleSubmit,
    labelButton,
    onHandleGames
  } = props;


  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    async function loadData() {
      try {
        const responseSlots = await get(`/slot/${currentLeague.id}`);
        const gamesResponse = await get(`/games/${currentLeague.id}`);
        const teamsResponse = await get(`/team/${currentLeague.id}`);

      // Cria um array de objetos com as informações dos jogos e times
        const gamesData = gamesResponse.map(game => {
        const teamshome = teamsResponse.find(team => team.id === +game.teamshome);
        const teamsaway = teamsResponse.find(team => team.id === +game.teamsaway);

        return {
          id: game.id,
          teamshome,
          teamsaway,
        }
      });

        setGames(gamesData);
        setTeams(teamsResponse);
        setSlots(responseSlots);
    }
    catch(e) {
      setIsLoading(false)
    }
    finally{
      setIsLoading(false)
    }
    }
    loadData()
  },[])
  const handleInputChange = (e) => {

    const {name, value } = e.target;
    handleChangeValues(name, value)
    setValues({
      ...values,
      [name]: value
    })
  }
  const handleInputChangeMultSelect = (e,newTeamValue , name) => {
    setValues({
      ...values,
      [name]: newTeamValue
    });
    handleChangeMultipleValues(e,newTeamValue, name)
  }
  

  const handleInputChangeSelect = (e,name) => {

    const {value} = e.target
    setValues({
      ...values,
      [name]: value
  })

  handleChangeMultipleValues(name, value)
  }
  const handleSubmit = (e) =>  {
    e.preventDefault()
    onHandleSubmit();
  }



  const handleOpenModal = () => {
    setIsOpenModal(true)
  }
  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const handleGameSelect = event => {
    const gameId = event.target.value;

    const game = games.find(game =>  gameId.find(g => g === game.id));

    setSelectedGames(prevSelectedGames => {
      // Adiciona o jogo selecionado apenas se ele ainda não foi selecionado
      if (!prevSelectedGames.some(selectedGame => selectedGame.id === gameId)) {
        return [...prevSelectedGames, game];
      }
      return prevSelectedGames;
    });

    onHandleGames(gameId)
  };

  const classes = useStyle();
  return (
    <>
    <Card>
    <Loader isLoading={isLoading}/>
      <AppBar titleAppBar={`Category - ${values.typeRestriction}`} sx={{textAlign: 'center'}}/>
      <GameModal open={isOpenModal} onClose={handleCloseModal} onSave={() => {}}/>
      <CardContent>
        <form className={classes.root} onSubmit={handleSubmit}>
          <Grid container>
            <Grid container item>
              <Grid item xs={6}>
                  <Input value={values.max}
                    onChange={handleInputChange}
                    name="max"
                    disabled={!values.max && values.max !== 0}
                    label="Max"
                    type="number"
                  />
                  <Input value={values.min}
                    onChange={handleInputChange}
                    disabled={!values.min && values.min !== 0}
                    name="min"
                    label="Min"
                    type="number"
                  />
              </Grid>
              <Grid item xs={6}>
                  <Select 
                  dataSelect={slots}
                  onHandleChange={handleInputChangeSelect}
                  label="Intervalo de tempo"
                  valueSelect={values.slots}
                  name="slots"
                  />
              </Grid>

            </Grid>
            <Grid container item>              
              <Grid item xs={6}>
                <Stack direction="row" divider={<Divider sx={{marginLeft: '35px', marginRight: '50px'}} orientation="vertical" flexItem />} sx={{marginTop: 2}}>
                  <RadioGroupCustomize 
                    name="type"
                    label="Type"
                    value={values.type}
                    onChange={handleInputChange}
                    items={itemsRadioType}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item xs={6}>
                <SliderCustom
                  name="penalty"
                  value={values.penalty}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={6}>
                <Stack direction='row' spacing={2} alignItems="center">
                <MuiSelect sx={{width: '500px'}}
                  multiple
                  value={selectedGames.map(game => game.id)}
                  onChange={handleGameSelect}
                  renderValue={selected => (
                    <div>
                      {selected.map(gameId => {
                        const game = games.find(game => game.id === gameId);
                        return (
                          <div key={game.id}>
                            {game.teamshome.name} x {game.teamsaway.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                >
                  {games.map(game => (
                    <MenuItem key={game.id} value={game.id}>
                      {game.teamshome.name} x {game.teamsaway.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                  <Button onClick={handleOpenModal}variant="outlined"sx={{height: '55px'}}startIcon={<DoubleArrow/>}>Add Game</Button>
                </Stack>
              </Grid>
            </Grid>
          <Grid />
        </Grid>

        <Box sx={{ marginTop: '50px',right: '15px', float: 'right', bottom: '25px', position:'relative'}} >
          <Button 
            endIcon={<Send/>}
            variant="contained"
            type="submit" >
              {labelButton}
          </Button>
        </Box>
      </form>
    </CardContent>
  </Card>
  </>
  )
}

FormRestrictions.propTypes = {
    initialValues: PropTypes.array.isRequired,
    handleChangeValues: PropTypes.func,
    handleChangeMultipleValues:PropTypes.func,
    itemsRadioType: PropTypes.array,
    onHandleSubmit:PropTypes.func.isRequired,
    labelButton: PropTypes.string,
    onHandleGames: PropTypes.func.isRequired
}

FormRestrictions.defaultProps = {
  labelButton: 'Cadastrar'
}