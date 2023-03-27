import { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Stack,
  Typography
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
  Timeline,
  InfoOutlined
} from '@mui/icons-material';
import {useTranslation} from 'react-i18next'
import { t } from 'i18next';
import { LeagueContext } from '../../hooks/useContextLeague';
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
    validationSchema,
    information
    
  } = props;

  const [values, setValues] = useState(initialValues);
  const {setValueStatusSolution} = useContext(LeagueContext);
  
  useEffect(() => {
    async function loadTeams() {
      const response = await get(`/team/${currentLeague.id}`);
      const responseSlots = await get(`/slot/${currentLeague.id}`);
      setTeams(response);
      setSlots(responseSlots)
    }
    loadTeams()
  }, [])

  const {t} = useTranslation();
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
    { 
      information &&
      (
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
      )
    }

      <Paper elevation={3} square sx={{width: '100%', padding: '5px'}}>
        <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
          <Button>{t('headTableRestriction')}</Button>
        </ButtonGroup>
        <form className={classes.root} onSubmit={handleSubmit}>
          <div className={classes.column}>
            <Tooltip 
              title={t('tooltipRestriction')}
              sx={{ 
                backgroundColor: '#ececec',
                color: 'white' 
              }}
            >
            <ButtonGroup fullWidth variant="string" sx={{color:"#2065D1"}}>
              <Button type="button" endIcon={<NotInterested/>}>{t('headTableRestriction')}</Button>
            </ButtonGroup>
            </Tooltip>
            {(
              values.typeRestriction === 'CA1' ||
              values.typeRestriction === 'CA3'||
              values.typeRestriction === 'CA4'
              )  && (
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px', justifyContent: 'flex-end'}}>
                      <Sports sx={{color:"#2065D1"}}/>
                      <Typography sx={{ color:"#2065D1" }}>
                        Nº máx de jogos
                      </Typography>
                    </Stack>

                    <Input
                      value={values.max}
                      onChange={handleInputChange}
                      name="max"
                      label={t('labelMax')}
                      type="number"
                      widthProp='480px'
                      error={!!errors.max }
                      messageError={errors.max}
                    />
                  </Box>
                )}
                
                {(
                  values.typeRestriction === 'SE1'
                )  && (

                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Sports sx={{color: '#2065D1'}}/>
                      <Typography sx={{ color:"#2065D1" }}>Nº min de jogos</Typography>

                    </Stack>
                    <Input
                      value={values.min}
                      onChange={handleInputChange}
                      name="min"
                      label={t('labelMin')}
                      type="number"
                      error={!!errors.min }
                      messageError={errors.min}
                    />
                  </Box>
                )}  
                {values.typeRestriction === 'CA2' && (
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px',marginRight: '8px', justifyContent: 'flex-end'}}>
                        <Sports sx={{color: '#2065D1'}} />
                        <Typography sx={{ color:"#2065D1"}}>
                          Nº de jogos
                        </Typography>
                      </Stack>
                      <Input
                        value={values.max}
                        onChange={handleInputChange}
                        name="max"
                        label={t('labelMax')}
                        type="number"
                        error={!!errors.max }
                        messageError={errors.max}
                        widthProp='227px'
                      />
                      <Input
                        value={values.min}
                        onChange={handleInputChange}
                        name="min"
                        label="Min"
                        type="number"
                        error={!!errors.min }
                        messageError={errors.min}
                        widthProp='227px'
                      />
                    </Box>
                  )}

                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px'
                  }}
                >     
                <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px',marginRight: '12px', justifyContent: 'flex-end'}}>
                  <Settings sx={{color: '#2065D1'}}/>
                  <Typography sx={{ color:"#2065D1" }}>
                    Prioridade
                  </Typography>

                </Stack>
                <Select
                  name="type"
                  label="Type"
                  value={values.type}
                  onChange={handleInputChange}
                  sx={{ width: '470px' }}
                >
                  {
                    itemsRadioType.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                    ))
                  }
                </Select>
                </Box>
                  
                  {(values.typeRestriction === 'CA3' || values.typeRestriction === 'BR1' || values.typeRestriction === 'FA2' || values.typeRestriction === 'BR2' || values.typeRestriction === 'FA2' ) && (
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{
                        width: '116px',
                        justifyContent: 'flex-end',
                        marginLeft: '32px'
                        }}>
                        <Timeline sx={{color: '#2065D1'}} />
                        <Typography sx={{color: '#2065D1', textAlign: 'center', marginRight: '8px'}}>
                          Jogos consecutivos
                        </Typography>
                      </Stack>
                      <Input
                        value={values.intp}
                        onChange={handleInputChange}
                        name="intp"
                        label={t('labelRounds')}
                        type="number"
                        error={errors.intp}
                        sx={{ width: '250px,', marginLeft: '16px' }}
                      />
                    </Box>
                    )}

                { values.typeRestriction !== 'SE1' && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px',marginRight: '12px', justifyContent: 'flex-end'}}>
                      <Home sx={{color: '#2065D1'}}/>
                      <Typography sx={{color: '#2065D1'}}>
                        Local
                      </Typography>
                    </Stack>
                    <Select
                      name="mode"
                      label="Mode"
                      value={values.mode}
                      onChange={handleInputChange}
                      sx={{width: '470px'}}
                    >
                      {
                        itemsRadioMode.map((item) => (
                          <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                        ))
                      }
                    </Select>
                  </Box>
                )} 
                  
                <SliderCustom
                  name="penalty"flexItem
                  value={values.penalty}
                  onChange={handleInputChange}
                />
              </div>
              <div className={classes.column}>
              
              <ButtonGroup fullWidth variant="string" sx={{color:"#2065D1"}}>
                <Button type="button" endIcon={<HowToReg/>}>{t('headTableApply')}</Button>
              </ButtonGroup>

              {/* ====================================Slots======================================================= */}
             
             { (values.typeRestriction !== 'CA3' &&  values.typeRestriction !== 'SE1') && (
              <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px', marginRight: '12px', justifyContent: 'flex-end'}}>
                    <WatchLater sx={{color: '#2065D1'}}/>
                    <Typography sx={{color: '#2065D1'}}>
                      Slots
                    </Typography>
                  </Stack>
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
              )}
            <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
              <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px', marginRight: '12px', justifyContent: 'flex-end'}}>
                <SportsSoccer sx={{color: '#2065D1'}}/>
                <Typography sx={{color: '#2065D1'}}>
                  Times
                </Typography>
              </Stack>
              <ContainerInline onHandleClick={handleClickSelectAll} name="teamsSelected">
                <MultipleSelectChip
                  dataMultSelect={teams}
                  valueMultSelect={values.teamsSelected}
                  disabled={!values.teamsSelected}
                  name="teamsSelected"
                  labelMultSelect={t('headTableNameTeams')}
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

                    <Stack direction="row" alignItems="center" spacing={1} sx={{width: '150px', marginRight: '12px', justifyContent: 'flex-end'}}>
                      <SportsSoccer sx={{color: '#2065D1'}}/>
                      <Typography sx={{color: '#2065D1'}}> {t('headTableNameTeams2')}</Typography>
                    </Stack>
                    <ContainerInline onHandleClick={handleClickSelectAll} name="teams2Selected">
                      <MultipleSelectChip
                        dataMultSelect={teams}
                        disabled={!values.teams2Selected}
                        valueMultSelect={values.teams2Selected}
                        name="teams2Selected"
                        labelMultSelect={t('headTableNameTeams')}
                        placeholderMultSelect=""
                        onHandleChange={handleInputChangeMultSelect}
                        error={!!errors.teams2Selected}
                        messageError={errors.teams2Selected}
                      />
                    </ContainerInline>
                    </Box>

                )}
                <Box sx={{ marginTop: '70px', right: '45px', float: 'right', bottom: '25px', position: 'relative' }}>
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


FormRestrictions.propsTypes = {
    initialValues: PropTypes.obj,
    handleChangeValues: PropTypes.func,
    itemsRadioType: PropTypes.array,
    itemsRadioMode: PropTypes.array,
    handleChangeMultipleValues: PropTypes.func,
    onHandleSubmit: PropTypes.func,
    labelButton: PropTypes.string,
    validationSchema: PropTypes.func,
    information: PropTypes.string
}
FormRestrictions.defaultProps = {
  labelButton: t('buttonAdd'), information: "",
  
}