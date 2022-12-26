import { useEffect , useState, useContext } from 'react';
import {Button, Container, Card, Box, Grid,MenuItem, Select,Slider,Stack, TextField,Typography, Tooltip} from '@mui/material';
import {SaveAs, Info} from '@mui/icons-material'
import {useTranslation} from 'react-i18next';
import { delay } from '../utils/formatTime';
import MultipleSelectChip from '../components/MultSelect';
import AppBar from '../components/AppBar'
import {LeagueContext} from '../hooks/useContextLeague';
import api from '../services/api';

import Loader from '../components/Loader';





export default function Ca3() {

  const [teams, setTeams] = useState([]);
  const [team2Form, setTeamForm2] = useState([]);
  const [intp, setIntp] = useState(0)
  const [slots, setSlots] = useState([]);
  const [max, setMaximum] = useState(0);
  const [min, setMinimum] = useState(0);
  const [penalty, setPenalty] = useState(70);
  const [type, setType] = useState('');
  const [mode1, setMode1] = useState('');
  const [mode2, setMode2] = useState('SLOTS');
  const [teamForm, setTeamForm] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  const {handleRestrictions} = useContext(LeagueContext)

  const {t} = useTranslation();
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [allSelected, setAllSelected] = useState(false)

  useEffect(() => {
    (async () => {
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
  const handleChangePenalty = (event, newValue) => {
    setPenalty(newValue);
  };

  const handleChangeMaximum = (event) => {
    setMaximum(event.target.value);
  };

  const handleChangeIntp = (event) => {
    setIntp(event.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeMode = (event) => {
    setMode1(event.target.value);
  };

  const handleAddConstraint = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    await delay(500);
    const leagueId = currentLeague.id;
    const {data} = await api.post('/ca3', {
      max,
      mode1,
      intp,
      mode2,
      type,
      leagueId,
      teamForm,
      team2Form,
      penalty
    });

    setMaximum(0);
    setIntp(0);
    setMode1('');
    setType('');
    setTeamForm([]);
    setTeamForm2([]);
    setPenalty(70);

    await handleRestrictions(data);

    setIsLoading(false)
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
        titleAppBar={`${t('headTableCapacity')}3`}
        titleModal={`${t('headTableCapacity')}3`}
        descriptionModal={t('descriptionModalRestriction')}
      />
        <Loader isLoading={isLoading}/>
        <Box component="form" sx={{margin: '15px'}} onSubmit={handleAddConstraint}>
          <Grid container spacing={0}>
            <Grid item xs={6}>

              <Stack direction="column" alignContent="center">
                <Typography variant="subtitle1" align="inherit" ml={1.5} mb={1} sx={{color:'#919EAB'}}>{t('headTableCategory')}</Typography>
                <TextField label={`${t('headTableCapacity')}3`} disabled sx={{width:'70%'}}/>
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
                  <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelRounds')}</Typography>
                  <TextField  type="number" value={intp} onChange={handleChangeIntp} />
                </Stack>

                  <Stack direction="column" alignContent="center">
                    <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>{t('labelMax')}</Typography>
                    <TextField type="number" value={max} onChange={handleChangeMaximum}/>
                  </Stack>
              </Stack>
              
            </Grid>
            <Grid item xs={6} sx={{display:"flex", flexDirection:'column'}} >            
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
                  value={mode1}
                  onChange={handleChangeMode}
                >
                <MenuItem value='H'>{t('valueLabelGameModeHome')}</MenuItem>
                <MenuItem value='A'>{t('valueLabelGameModeAway')}</MenuItem>
                <MenuItem value='HA'>{t('valueLabelGameModeHomeAway')}</MenuItem>
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