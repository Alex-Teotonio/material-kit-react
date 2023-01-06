import { useEffect , useState, useContext } from 'react';
import {Button, Container, Card, Box, Grid,MenuItem, Select,Slider,Stack, TextField,Typography, Tooltip} from '@mui/material';
import {SaveAs} from '@mui/icons-material'
import {useTranslation} from 'react-i18next'
import { delay } from '../utils/formatTime';
import MultipleSelectChip from '../components/MultSelect';
import AppBar from '../components/AppBar'
import {LeagueContext} from '../hooks/useContextLeague';
import api from '../services/api';

import Loader from '../components/Loader';

export default function Ca1() {

  const [teams, setTeams] = useState([]);
  const [teamPublicId, setTeamPublicId] = useState([]);
  const [slotPublicId, setSlotPublicId] = useState([]);
  const [slots, setSlots] = useState([]);
  const [max, setMaximum] = useState(0);
  const [penalty, setPenalty] = useState(70);
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [teamForm, setTeamForm] = useState([]);
  const [slotForm, setSlotForm] = useState();

  const [isLoading, setIsLoading] = useState(false)

  const {handleRestrictions} = useContext(LeagueContext);

  const {t} = useTranslation();

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [allSelected, setAllSelected] = useState(false)

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token')
      if(token) {
        api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      }
      const response = await api.get(`/team/${currentLeague.id}`);
      const responseSlots = await api.get(`/slot/${currentLeague.id}`);
      setTeams(response.data);
      setSlots(responseSlots.data);
    })();
  }, []);


  const handleChangeTeam = (e, newTeamValue) => {
    const arrayTeams = [];
    const arrayPublicId = [];
    if (newTeamValue) {
      newTeamValue.map((team) => {
        arrayTeams.push(team.id);
        return arrayTeams;
      });
      setTeamForm(arrayTeams);
    }

    if (newTeamValue) {
      newTeamValue.map((team) => {
        arrayPublicId.push(team.publicid);
        return arrayPublicId;
      });
      setTeamPublicId(arrayPublicId);
    }
  };

  const handleChangeSlot = (e, newSlotValue) => {
    const arraySlots = [];
    const arrayPublicId = [];
    if (newSlotValue) {
      newSlotValue.map((slot) => {
        arraySlots.push(slot.id);
        return arraySlots;
      });
      setSlotForm(arraySlots)
    }


    if (newSlotValue) {
      newSlotValue.map((slot) => {
        arrayPublicId.push(slot.publicid);
        return arrayPublicId;
      });
      setSlotPublicId(arrayPublicId)
    }
  };

  const handleChangePenalty = (event, newValue) => {
    setPenalty(newValue);
  };

  const handleChangeMaximum = (event) => {
    setMaximum(event.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  };

  const handleAddConstraint = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    await delay(500);
    const leagueId = currentLeague.id;

    console.log(teamForm)
    const {data} = await api.post('/ca1', {
      max,
      mode,
      type,
      leagueId,
      teamForm,
      slotForm,
      penalty,
      slotPublicId,
      teamPublicId
    });

    await handleRestrictions(data);

    setMaximum(0);
    setMode('');
    setType('');
    setTeamForm([]);
    setSlotForm([]);
    setPenalty(70);

    setIsLoading(false)
  }

  const handleSelectAllClickSlots = () => {
    const arraySlots = [];
    slots.map((slot) =>arraySlots.push(slot.id) )
    setSlotForm(arraySlots);
    setAllSelected(true)
  }


  const handleSelectAllClickTeams = () => {
    const arrayTeams = [];
    teams.map((team) =>arrayTeams.push(team.id) )
    handleChangeTeam(null,arrayTeams)
    setTeamForm(arrayTeams)
    setAllSelected(true)
  }

  return (
    <Container maxWidth='xl' sx={{borderRadius: '5px'}}>
      <Card>
      <AppBar 
        titleAppBar={`${t('headTableCapacity')}1`}
        titleModal={`${t('headTableCapacity')}1`}
        descriptionModal={t('descriptionModalRestriction')}
      />
        <Loader isLoading={isLoading}/>
        <Box component="form" sx={{margin: '15px'}} onSubmit={handleAddConstraint}>
          <Grid container spacing={0}>
            <Grid item xs={6}>

              <Stack direction="column" alignContent="center">
                <Typography variant="subtitle1" align="inherit" ml={1.5} mb={1} sx={{color:'#919EAB'}}>{t('headTableCategory')}</Typography>
                <TextField label={`${t('headTableCapacity')}1`} disabled sx={{width:'70%'}}/>
              </Stack>

              <Stack direction="column" alignContent="center" sx={{marginTop:'20px'}}>
                <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('headTableType')}</Typography>
                <Select
                    label={t('headTableCategory')}
                    placeholder='Tipo'
                    sx={{width:'70%'}}
                    value={type}
                    onChange={handleChangeType}
                  >
                  <MenuItem value='hard'>{t('valueLabelTypeHard')}</MenuItem>
                  <MenuItem value='soft'>{t('valueLabelTypeSoft')}</MenuItem>
                
                </Select>
              </Stack>

              <Stack direction="column" alignContent="center" sx={{marginTop:'20px'}}>
                <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('headTablePenalty')}</Typography>
                <Slider sx={{width:'70%' , marginLeft: '10px'}} value={penalty} onChange={handleChangePenalty}/>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: '20px'}}>
                
                <Stack direction="column" alignContent="center" >
                  <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelMin')}</Typography>
                  <TextField  type="number" disabled  />
                </Stack>

                  <Stack direction="column" alignContent="center">
                    <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelMax')}</Typography>
                    <TextField type="number" value={max} onChange={handleChangeMaximum}/>
                  </Stack>
              </Stack>
              
            </Grid>
            <Grid item xs={6} sx={{display:"flex", flexDirection:'column'}} >

            <Stack direction="column" alignContent="center">
              <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('headTableNameSlots')}</Typography>

                <Stack direction="row" alignContent="center" spacing={2} sx={{ width: '85%'}}>              
                  <MultipleSelectChip
                    dataMultSelect={slots}
                    labelMultSelect=""
                    placeholderMultSelect=""
                    onHandleChange={handleChangeSlot}
                    marginTopString=""

                  />

                  <Button disabled={allSelected}variant='outlined' sx={{ width:'15%'}} onClick={handleSelectAllClickSlots}>{t('buttonAllSelect')}</Button>
                </Stack>
            </Stack>
            
            <Stack direction="column" alignContent="center" sx={{ width: '85%', marginTop: '20px'}}>
              <Typography 
                variant="subtitle1"
                align="inherit"
                mb ={1}
                ml={1.5}
                sx={{color:'#919EAB'}}
              >
                {t('headTableNameTeams')}
              </Typography>

              <Stack direction="row" alignContent="center" spacing={2}>              
                <MultipleSelectChip 
                  dataMultSelect={teams}
                  labelMultSelect=""
                  placeholderMultSelect=""
                  onHandleChange={handleChangeTeam}
                />
                <Button disabled={allSelected}variant='outlined' sx={{ width:'15%'}} onClick={handleSelectAllClickTeams}>{t('buttonAllSelect')}</Button>
              </Stack>
            </Stack>
            
            <Stack direction="column" alignContent="center" sx={{ width: '70%', marginTop: '20px'}}>
              <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelGameMode')}</Typography>
                <Select
                  value={mode}
                  onChange={handleChangeMode}
                >
                <MenuItem value='H'>{t('valueLabelGameModeHome')}</MenuItem>
                <MenuItem value='A'>{t('valueLabelGameModeAway')}</MenuItem>
              </Select>
            </Stack>

              <Button startIcon={<SaveAs/>} sx={{width: '15%', position:'absolute', bottom:'15px', right:'70px'}}variant="outlined" type="submit" >{t('buttonSave')}</Button>

            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>  
  )
}