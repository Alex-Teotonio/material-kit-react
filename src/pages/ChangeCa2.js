import { useEffect , useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {Button, Container, Card, Box, Grid,MenuItem, Select,Slider,Stack, TextField,Typography, Tooltip} from '@mui/material';
import {SaveAs, Info} from '@mui/icons-material'
import {useTranslation} from 'react-i18next';
import { delay } from '../utils/formatTime';
import MultipleSelectChip from '../components/MultSelect';
import AppBar from '../components/AppBar'
import {LeagueContext} from '../hooks/useContextLeague';
import api from '../services/api';
import {get} from '../services/requests';


import Loader from '../components/Loader';

export default function ChangeCa2() {

  const [teams, setTeams] = useState([]);
  const [teamForm2, setTeamForm2] = useState([]);
  const [slots, setSlots] = useState([]);
  const [max, setMaximum] = useState(0);
  const [min, setMinimum] = useState(0);
  const [penalty, setPenalty] = useState(70);
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [mode2, setMode2] = useState('GLOBAL');
  const [teamFormIds, setTeamFormIds] = useState([]);
  const [slotFormIds, setSlotFormIds] = useState([]);
  const [teamForm, setTeamForm] = useState([]);
  const [teamForm2Ids, setTeamForm2Ids] = useState([]);

  const [slotForm, setSlotForm] = useState();
  const {id} = useParams();

  const [isLoading, setIsLoading] = useState(false)

  const {handleRestrictions} = useContext(LeagueContext)

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

      const ca2Response = await get(`/ca2/${id}`);
      setType(ca2Response.type);
      setMode(ca2Response.mode1);
      setMode2(ca2Response.mode2);
      setMinimum(ca2Response.min)
      setMaximum(ca2Response.max);
      setPenalty(ca2Response.penalty);

      const ca2Slots = await get(`/ca2_slots/${id}`);

      const newSlots = ca2Slots.map((ca2) => ca2);
      const newSlotsIds = ca2Slots.map((ca2) => ca2.id);
      setSlotForm(newSlots);
      setSlotFormIds(newSlotsIds)

      const ca2Teams = await get(`/ca2_teams/${id}`);
      const newTeams = ca2Teams.map((ca2) => ca2);
      const newTeamsIds = ca2Teams.map((ca2) => ca2.id);
      setTeamForm(newTeams);
      setTeamFormIds(newTeamsIds);

      const ca2Teams2 = await get(`/ca2_teams_2/${id}`);
      const newTeams2 = ca2Teams2.map((ca2) => ca2);
      const newTeams2Ids = ca2Teams2.map((ca2) => ca2.id);
      setTeamForm2(newTeams2);
      setTeamForm2Ids(newTeams2Ids); 



      const response = await api.get(`/team/${currentLeague.id}`);
      const responseSlots = await api.get(`/slot/${currentLeague.id}`);
      setTeams(response.data);
      setSlots(responseSlots.data);

    })();
  }, []);


  const handleChangeTeam = (e, newTeamValue) => {
    const arrayTeams = [];
    if (newTeamValue) {
      newTeamValue.map((team) => {
        arrayTeams.push(team.id);
        return arrayTeams;
      });
      setTeamForm(arrayTeams);
    }
  };


  const handleChangeTeam2 = (e, newTeamValue) => {
    const arrayTeams2 = []
    if (newTeamValue) {
      newTeamValue.map((team) => {
        arrayTeams2.push(team.id);
        return arrayTeams2;
      });
      setTeamForm2(arrayTeams2);
    }
  };


  const handleChangeSlot = (e, newSlotValue) => {

    const arraySlots = [];
    if (newSlotValue) {
      newSlotValue.map((slot) => {
        arraySlots.push(slot.id);
        return arraySlots;
      });
      setSlotForm(arraySlots);
    } else  {
      slots.map((row) => {
        arraySlots.push(row.id)
        return arraySlots
      })

      setSlotForm(arraySlots)
    }
  };

  const handleChangePenalty = (event, newValue) => {
    setPenalty(newValue);
  };

  const handleChangeMaximum = (event) => {
    setMaximum(event.target.value);
  };

  const handleChangeMinimum = (event) => {
    setMinimum(event.target.value);
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
    const {data} = await api.put(`/ca2/${id}`, {
      min,
      max,
      mode,
      mode2,
      type,
      leagueId,
      teamFormIds,
      teamForm2,
      slotFormIds,
      penalty
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
        titleAppBar={`${t('headTableCapacity')}2`}
        titleModal={`${t('headTableCapacity')}2`}
        descriptionModal={t('descriptionModalRestriction')}
      />
        <Loader isLoading={isLoading}/>
        <Box component="form" sx={{margin: '15px'}} onSubmit={handleAddConstraint}>
          <Grid container spacing={0}>
            <Grid item xs={6}>

              <Stack direction="column" alignContent="center">
                <Typography variant="subtitle1" align="inherit" ml={1.5} mb={1} sx={{color:'#919EAB'}}>{t('headTableCategory')}</Typography>
                <TextField label={`${t('headTableCapacity')}2`} disabled sx={{width:'70%'}}/>
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
                  <TextField  type="number" value={min} onChange={handleChangeMinimum} />
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
                    valueMultSelect={slotForm}
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
                  valueMultSelect={teamForm}
                  labelMultSelect=""
                  placeholderMultSelect=""
                  onHandleChange={handleChangeTeam}
                />
                <Button disabled={allSelected}variant='outlined' sx={{ width:'15%'}} onClick={handleSelectAllClickTeams}>{t('buttonAllSelect')}</Button>
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
                {`${t('headTableNameTeams')}2`}
              </Typography>

              <Stack direction="row" alignContent="center" spacing={2}>              
                <MultipleSelectChip 
                  dataMultSelect={teams}
                  valueMultSelect={teamForm2}
                  labelMultSelect=""
                  placeholderMultSelect=""
                  onHandleChange={handleChangeTeam2}
                />
                <Button disabled={allSelected}variant='outlined' sx={{ width:'15%'}} onClick={handleSelectAllClickTeams}>{t('buttonAllSelect')}</Button>
              </Stack>
            </Stack>
            
            <Stack direction="column" alignContent="center" sx={{ width: '85%', marginTop: '20px', marginBottom: '55px'}}>
              <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelGameMode')}</Typography>
                <Select
                  value={mode}
                  onChange={handleChangeMode}
                >
                <MenuItem value='H'>{t('valueLabelGameModeHome')}</MenuItem>
                <MenuItem value='A'>{t('valueLabelGameModeAway')}</MenuItem>
              </Select>
            </Stack>

              <Button startIcon={<SaveAs/>} sx={{width: '15%', position:'absolute', bottom:'10px', right:'70px'}}variant="outlined" type="submit" >{t('buttonSave')}</Button>

            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>  
  )
}