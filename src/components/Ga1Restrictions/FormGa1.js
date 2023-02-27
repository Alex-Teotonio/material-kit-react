
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
  Select as MuiSelect,
  Tooltip
} from '@mui/material';

import { Sports , Send,DoubleArrow, Settings, WatchLater} from '@mui/icons-material';

import { PropTypes } from 'prop-types';
  import Loader from '../Loader'
import SliderCustom from "../Slider";
import {get} from '../../services/requests';

import Input from '../Input';
import ContainerInline from '../BasicRestrictions/Utilities'
import AppBar from '../AppBar';
import MultipleSelectChip from '../MultSelect';

import GameModal from '../../pages/ModalGames'

import Select from '../SelectDefault'

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiTextField-root": {
      margin: '12px',
    },
  },
  column: {
    display: "inline-block",
    verticalAlign: "top",
    width: "50%",
    marginTop: '8px'
  },
  button: {
    margin: '12 px',
  },
}));

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
    console.log('FOrmGa1', e, newTeamValue, name)
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

  const handleClickSelectAll = (name) => {
    const renderValues = {'teamsSelected': teams,'teams2Selected': teams, 'slots':slots}
    const selectAll = renderValues[name]
    setValues({
      ...values,
      [name]: selectAll
    })
    handleChangeMultipleValues(null,selectAll, name)
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

  const gameOptions = games.map((game) => {
    const optionLabel = `${game.teamshome.name} x ${game.teamsaway.name}`;
    return { id: game.id, name: optionLabel };
  });

  const classes = useStyles();
  return (
    <>
    <Card>
    <Loader isLoading={isLoading}/>
      <AppBar titleAppBar={`Category - ${values.typeRestriction}`} sx={{textAlign: 'center'}}/>
      <GameModal open={isOpenModal} onClose={handleCloseModal} onSave={() => {}}/>
      <CardContent>
        <form className={classes.root} onSubmit={handleSubmit}>
        <div className={classes.column}>
        <Tooltip 
          title="Defina a quantidade de jogos ao qual a restrição será aplicada."
          sx={{ 
            backgroundColor: '#ececec',
            color: 'white' 
          }}
        >
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap'
          }}>
            <Button 
              sx={{ 
                marginLeft: '8px',
                color:"#2065D1",
                width: '150px'
              }}
              variant="string"
              startIcon={<Sports/>}
            >
              Nº min de jogos
            </Button>
          <Input value={values.max}
            onChange={handleInputChange}
            name="max"
            disabled={!values.max && values.max !== 0}
            label="Max"
            type="number"
            widthProp ='250px'
          />
          <Input value={values.min}
            onChange={handleInputChange}
            disabled={!values.min && values.min !== 0}
            name="min"
            label="Min"
            type="number"
            widthProp ='250px'
          />
        </Box>
        </Tooltip>
<Tooltip 
  title="Defina a importcia dessa restrição."
  sx={{ 
    backgroundColor: 'gray',
    color: 'white' 
  }}
  >
  <Box 
    sx={{ 
      display:'flex',
      alignItems: 'center',
      marginBottom: '12px'
    }}
  >
    <Button 
      sx={{
        marginLeft:'8px',
        color:"#2065D1" ,
        width: '150px'
      }}
      variant="string"
      startIcon={<Settings/>}
    >
      Prioridade
    </Button>

    <MuiSelect
      name="type"
      label="Type"
      value={values.type}
      onChange={handleInputChange}
      sx={{marginLeft: '14px',width: '500px'}}
    >
      {
        itemsRadioType.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
        ))
      }
    </MuiSelect>
  </Box>
  </Tooltip>

  <SliderCustom
    name="penalty"
    value={values.penalty}
    onChange={handleInputChange}
  />
</div>

      <div  className={classes.column}>
      <Box sx={{ 
        marginTop: '50px',
        right: '15px',
        top: '17px',
        position: 'absolute'
      }}>
        <Button 
          onClick={handleOpenModal}
          variant="string"
          sx={{height: '25px'}}
          startIcon={<DoubleArrow/>}
        >
          Add Game
        </Button>
      </Box>

      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          marginBottom: '12px'
        }}
      >
      <Button 
        sx={{ 
          marginLeft: '8px',
          color:"#2065D1",
          width: '100px'
        }}
        variant="string"
        startIcon={<WatchLater/>}
      >
        Slots
      </Button>
        {/* <Select 
        dataSelect={slots}
        onHandleChange={handleInputChangeSelect}
        label="Intervalo de tempo"
        valueSelect={values.slots}
        name="slots"
        /> */}


<ContainerInline onHandleClick={handleClickSelectAll} name="slots">
  <MultipleSelectChip
    dataMultSelect={slots}
    valueMultSelect={values.slots}
    disabled={!values.slots}
    name="slots"
    labelMultSelect="Intervalo de tempo"
    placeholderMultSelect=""
    onHandleChange={handleInputChangeMultSelect}
  />
</ContainerInline>
        </Box>
        <Box
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            marginBottom: '12px'
          }}
        >
        <Button 
          sx={{ 
            marginLeft: '8px',
            color:"#2065D1",
            width: '100px'
          }}
          variant="string"
          startIcon={<WatchLater/>}
        >
          Games
        </Button>
        {/* <MuiSelect sx={{width: '500px'}}
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
        </MuiSelect> */}

<ContainerInline onHandleClick={handleClickSelectAll} name="games">
  <MultipleSelectChip
    dataMultSelect={gameOptions}
    valueMultSelect={values.games}
    name="games"
    labelMultSelect="Games"
    placeholderMultSelect=""
    onHandleChange={handleInputChangeMultSelect}
  />
</ContainerInline>
        </Box>
      <Box sx={{ marginTop: '50px', right: '15px', float: 'right', bottom: '0px', position: 'relative' }}>
        <Button 
          endIcon={<Send />}
          variant="contained"
          type="submit"
        >
          {labelButton}
        </Button>
      </Box>
      </div>
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