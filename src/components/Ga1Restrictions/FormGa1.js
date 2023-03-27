
import {useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select as MuiSelect,
  Typography,
  Tooltip
} from '@mui/material';

import { Sports , Send,DoubleArrow, Settings, WatchLater, InfoOutlined} from '@mui/icons-material';

import { PropTypes } from 'prop-types';
  import Loader from '../Loader'
import SliderCustom from "../Slider";
import {get} from '../../services/requests';

import Input from '../Input';
import ContainerInline from '../BasicRestrictions/Utilities'
import AppBar from '../AppBar';
import MultipleSelectChip from '../MultSelect';

import GameModal from '../../pages/ModalGames'

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

  const {t} = useTranslation();
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState({});

  const [slots, setSlots] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false)

  const {
    initialValues,
    handleChangeValues,
    itemsRadioType,
    handleChangeMultipleValues,
    onHandleSubmit,
    labelButton,
    onHandleGames,
    validationSchema,
    information
  } = props;


  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  
  useEffect(() => {
    async function loadData() {
      try {
        const responseSlots = await get(`/slot/${currentLeague.id}`);
        const teamsResponse = await get(`/team/${currentLeague.id}`);
        const gamesResponse = await get(`/games/${currentLeague.id}`);

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
  },[]);

  const handleAddGame = (game) => {
      const teamshome = teams.find(team => team.id === game.teamshome);
      const teamsaway = teams.find(team => team.id === game.teamsaway);

      const newGame =  {
        id: game.id,
        teamshome,
        teamsaway,
      };
      setGames((prevGames) => [...prevGames, newGame]);
  };
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(values, { abortEarly: false });
      onHandleSubmit();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setErrors(errors);
      }
    }
  }

  const handleDeleteGame = (deletedGameId) =>  {
    setGames((prevGames) => prevGames.filter((game) => game.id !== deletedGameId));
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
  const gameOptions = games.map((game) => {
    const optionLabel = `${game.teamshome.name} x ${game.teamsaway.name}`;
    return { id: game.id, name: optionLabel };
  });

  const classes = useStyles();
  return (
    <>

{ information && (
      <Box sx={{ 
        bgcolor: '#E6F3FF',
        color: 'blue',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
        }}>
        <IconButton sx={{ color: 'blue' }}>
          <InfoOutlined />
        </IconButton>
        <Typography variant="body1" sx={{ marginLeft: '4px' }}>
          {information}
        </Typography>
      </Box>
    )}
    <Card>
    <Loader isLoading={isLoading}/>
      <AppBar titleAppBar={`Category - ${values.typeRestriction}`} sx={{textAlign: 'center'}}/>
      <GameModal 
        open={isOpenModal}
        onClose={handleCloseModal}
        onAddGame={handleAddGame}
        onDelete={handleDeleteGame}
      />
      <CardContent>
        <form className={classes.root} onSubmit={handleSubmit}>
        <div className={classes.column}>
        <Tooltip 
          title={t('tooltipGamesMin')}
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
              {t('labelMin')}
            </Button>
          <Input value={values.min}
            onChange={handleInputChange}
            name="min"
            label={t('labelMin')}
            type="number"
            widthProp ='250px'
            error={!!errors.min }
            messageError={errors.min}
          />
          <Input value={values.max}
            onChange={handleInputChange}
            name="max"
            label={t('labelMax')}
            type="number"
            widthProp ='250px'
            error={!!errors.max }
            messageError={errors.max}
          />
        </Box>
        </Tooltip>
<Tooltip 
  title={t('tooltipPriority')}
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
      {t('labelPriority')}
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
          {t('buttonAddGame')}
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
        {t('headTableNameSlots')}
      </Button>


<ContainerInline onHandleClick={handleClickSelectAll} name="slots">
  <MultipleSelectChip
    dataMultSelect={slots}
    valueMultSelect={values.slots}
    disabled={!values.slots}
    name="slots"
    labelMultSelect={t('headTableNameSlots')}
    placeholderMultSelect=""
    onHandleChange={handleInputChangeMultSelect}
    error={!!errors.slots}
    messageError={errors.slots}
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
          {t('labelGames')}
        </Button>
        
<ContainerInline onHandleClick={handleClickSelectAll} name="games">
  <MultipleSelectChip
    dataMultSelect={gameOptions}
    valueMultSelect={values.games}
    name="games"
    labelMultSelect={t('labelGames')}
    placeholderMultSelect=""
    onHandleChange={handleInputChangeMultSelect}
    error={!!errors.games}
    messageError={errors.games}
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
    onHandleGames: PropTypes.func.isRequired,
    validationSchema: PropTypes.func.isRequired
}

FormRestrictions.defaultProps = {
  labelButton: 'Cadastrar'
}