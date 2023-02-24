import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { 
  Home,
  NotInterested,
  Send,
  Sports,
  Settings,
  SportsSoccer,
  WatchLater,
  HowToReg,
  TimeLine,
  Timeline
} from '@mui/icons-material';
import toast from '../../utils/toast';
import SliderCustom from '../Slider';
import { get } from '../../services/requests';

import Input from '../Input';
import MultipleSelectChip from '../MultSelect';

import ContainerInline from './Utilities';


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
  const [teams, setTeams] = useState([]);
  const [slots, setSlots] = useState([]);
  const [errors, setErrors] = useState({});

  const {
    initialValues,
    handleChangeValues,
    itemsRadioType,
    itemsRadioMode,
    handleChangeMultipleValues,
    onHandleSubmit,
    labelButton,
    validationSchema
  } = props;

  const [values, setValues] = useState(initialValues);
  
  useEffect(() => {
    async function loadTeams() {
      const response = await get(`/team/${currentLeague.id}`);
      const responseSlots = await get(`/slot/${currentLeague.id}`);
      setTeams(response);
      setSlots(responseSlots)
    }
    loadTeams()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChangeValues(name, value)
    setValues({
      ...values,
      [name]: value
    })
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

  const handleInputChangeMultSelect = (e, newTeamValue, name) => {
    setValues({
      ...values,
      [name]: newTeamValue
    });
    handleChangeMultipleValues(e, newTeamValue, name)
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
  const classes = useStyles();
  return (
    <>
      <Paper elevation={3} square sx={{width: '100%', padding: '5px'}}>
        <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button>{`Category - ${values.typeRestriction} `}</Button>
        </ButtonGroup>
          <form className={classes.root} onSubmit={handleSubmit}>
              <div className={classes.column}>

              <Tooltip 
                title="Nesta seção, defina as restrições que serão aplicadas às atribuições"
                sx={{ 
                  backgroundColor: '#ececec',
                  color: 'white' 
                }}
              >
                <ButtonGroup
                  variant="string"
                  sx={{
                    color:"#2065D1",
                  }}
                >
                  <Button endIcon={<NotInterested/>}>Constraints</Button>
                </ButtonGroup>
              </Tooltip>
              {  
                (
                  values.typeRestriction === 'CA1' ||
                  values.typeRestriction === 'CA3'||
                  values.typeRestriction === 'CA4'
                )  && (
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
                        Nº máx de jogos
                      </Button>
                      <Input
                        value={values.max}
                        onChange={handleInputChange}
                        name="max"
                        label="Max"
                        type="number"
                        error={!!errors.max }
                        messageError={errors.max}
                      />
                    </Box>
                  </Tooltip>
                )}


{  
                (
                  values.typeRestriction === 'SE1'
                )  && (
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
                      <Input
                        value={values.min}
                        onChange={handleInputChange}
                        name="min"
                        label="Min"
                        type="number"
                        error={!!errors.min }
                        messageError={errors.min}
                      />
                    </Box>
                  </Tooltip>
                )}

              {  
                values.typeRestriction === 'CA2' && (
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
                        Nº máx de jogos
                      </Button>
                      <Input
                        value={values.max}
                        onChange={handleInputChange}
                        name="max"
                        label="Max"
                        type="number"
                        error={!!errors.max }
                        messageError={errors.max}
                        widthProp ='250px'
                      />

                      <Input
                        value={values.min}
                        onChange={handleInputChange}
                        name="min"
                        label="Min"
                        type="number"
                        error={!!errors.min }
                        messageError={errors.min}
                        widthProp ='227px'
                      />
                    </Box>
                  </Tooltip>
                )}
                {(values.typeRestriction === 'CA3' || values.typeRestriction === 'BR1' || values.typeRestriction === 'FA2' || values.typeRestriction === 'BR2' || values.typeRestriction === 'FA2' ) && (
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
                      startIcon={<Timeline/>}
                      >
                        Jogos consecutivos
                    </Button>
                  <Input
                    value={values.intp}
                    onChange={handleInputChange}
                    name="intp"
                    label="Jogos consecutivos"
                    type="number"
                    error={errors.intp}
                  />
                  </Box>
                  </Tooltip>
                )}
                
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

                  <Select
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
                  </Select>
                </Box>
                </Tooltip>
                { values.typeRestriction !== 'SE1' && (
                <Tooltip 
                title="Defina o modo de jogo."
                sx={{ 
                  backgroundColor: 'gray',
                  color: 'white' 
                }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                        marginBottom: '12px'
                    }}>
                    <Button 
                      sx={{
                        marginLeft:'8px',
                        color:"#2065D1",
                        width: '150px'
                      }}
                      variant="string"
                      startIcon={<Home/>}
                    >
                      Local
                    </Button>
                  <Select
                    name="mode"
                    label="Mode"
                    value={values.mode}
                    onChange={handleInputChange}
                    sx={{marginLeft: '14px',width: '500px'}}
                  >
                    {
                      itemsRadioMode.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                      ))
                    }
                  </Select>
                  </Box>
                </Tooltip>
                )} 
                  
                <SliderCustom
                  name="penalty"flexItem
                  value={values.penalty}
                  onChange={handleInputChange}
                />
              </div>
              <div className={classes.column}>
              
              <ButtonGroup fullWidth variant="string" sx={{color:"#2065D1"}}>
                <Button type="button" endIcon={<HowToReg/>}>Aplica a</Button>
              </ButtonGroup>

              {/* ====================================Slots======================================================= */}
             
             { (values.typeRestriction !== 'CA3' &&  values.typeRestriction !== 'SE1') && (
              <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
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
                <ContainerInline onHandleClick={handleClickSelectAll} name="slots">
                  <MultipleSelectChip
                    dataMultSelect={slots}
                    valueMultSelect={values.slots}
                    disabled={!values.slots}
                    name="slots"
                    labelMultSelect="Intervalo de tempo"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                    error={!!errors.slots}
                    messageError={errors.slots}
                  />
                </ContainerInline>
              </Box>
              )}
            <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
              <Button 
                sx={{ 
                  marginLeft: '8px',
                  color:"#2065D1",
                  width: '100px'
                }}
                variant="string"
                startIcon={<SportsSoccer/>}
              >
                Times
              </Button>
                <ContainerInline onHandleClick={handleClickSelectAll} name="teamsSelected">
                  <MultipleSelectChip
                    dataMultSelect={teams}
                    valueMultSelect={values.teamsSelected}
                    disabled={!values.teamsSelected}
                    name="teamsSelected"
                    labelMultSelect="Teams"
                    placeholderMultSelect=""
                    onHandleChange={handleInputChangeMultSelect}
                    error={!!errors.teamsSelected}
                    messageError={errors.teamsSelected}
                  />
                </ContainerInline>
              </Box>
{/* ==========================================Times================================================================= */}
              {(values.typeRestriction === 'CA2' || values.typeRestriction === 'CA3' || values.typeRestriction === 'CA4') && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                  <Button 
                    sx={{ 
                      marginLeft: '8px',
                      color:"#2065D1",
                      width: '100px'
                    }}
                    variant="string"
                    startIcon={<SportsSoccer/>}
                  >
                    Times2
                  </Button>
                    <ContainerInline onHandleClick={handleClickSelectAll} name="teams2Selected">
                      <MultipleSelectChip
                        dataMultSelect={teams}
                        disabled={!values.teams2Selected}
                        valueMultSelect={values.teams2Selected}
                        name="teams2Selected"
                        labelMultSelect="Adversário"
                        placeholderMultSelect=""
                        onHandleChange={handleInputChangeMultSelect}
                        error={errors.teams2Selected}
                      />
                    </ContainerInline>
                    </Box>

                )}
                <Box sx={{ marginTop: '50px', right: '15px', float: 'right', bottom: '25px', position: 'relative' }}>
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
      </Paper>
    </>
  )
}


FormRestrictions.propTypes = {
  initialValues: PropTypes.object.isRequired,
  handleChangeValues: PropTypes.func.isRequired,
  itemsRadioType: PropTypes.array.isRequired,
  itemsRadioMode: PropTypes.array.isRequired,
  handleChangeMultipleValues:PropTypes.func.isRequired,
  onHandleSubmit:PropTypes.func.isRequired,
  labelButton: PropTypes.string,
  validationSchema: PropTypes.object.isRequired
} 
FormRestrictions.defaultProps = {
  labelButton: 'Cadastrar'
}