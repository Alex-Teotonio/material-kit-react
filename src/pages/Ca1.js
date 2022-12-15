import { useEffect , useState, useContext } from 'react';
import {Button, Container, Card, Box, Grid,MenuItem, Select,Slider,Stack, TextField,Typography} from '@mui/material';
import {SaveAs} from '@mui/icons-material'
import { delay } from '../utils/formatTime';
import MultipleSelectChip from '../components/MultSelect';
import {LeagueContext} from '../hooks/useContextLeague';
import api from '../services/api';

import Loader from '../components/Loader';





export default function Ca1() {

  const [teams, setTeams] = useState([]);
  const [slots, setSlots] = useState([]);
  const [max, setMaximum] = useState(0);
  const [penalty, setPenalty] = useState(70);
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [teamForm, setTeamForm] = useState([]);
  const [slotForm, setSlotForm] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  const {handleRestrictions} = useContext(LeagueContext)

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

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

  const handleChangeSlot = (e, newSlotValue) => {
    const arraySlots = [];
    if (newSlotValue) {
      newSlotValue.map((slot) => {
        arraySlots.push(slot.id);
        return arraySlots;
      });
      setSlotForm(arraySlots);
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
    const {data} = await api.post('/ca1', {
      max,
      mode,
      type,
      leagueId,
      teamForm,
      slotForm,
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

  return (
    <Container>
      <Card>
        <Loader isLoading={isLoading}/>
        <Box component="form" sx={{margin: '15px'}} onSubmit={handleAddConstraint}>
          <Grid container>
            <Grid item xs={6}>

              <Stack direction="column" alignContent="center">
                <Typography variant="subtitle1" align="inherit" ml={1.5} mb={1} sx={{color:'#919EAB'}}>Categoria</Typography>
                <TextField label="Capacidade1" disabled sx={{width:'70%'}}/>
              </Stack>

              <Stack direction="column" alignContent="center" sx={{marginTop:'20px'}}>
                <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Tipo</Typography>
                <Select
                    label="Categoria"
                    placeholder='Tipo'
                    sx={{width:'70%'}}
                    value={type}
                    onChange={handleChangeType}
                  >
                  <MenuItem value='hard'>Forte</MenuItem>
                  <MenuItem value='soft'>Fraca</MenuItem>
                
                </Select>
              </Stack>

              <Stack direction="column" alignContent="center" sx={{marginTop:'20px'}}>
                <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Penalidade</Typography>
                <Slider sx={{width:'69%' , marginLeft: '10px'}} value={penalty} onChange={handleChangePenalty}/>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '70%', marginTop: '20px'}}>
                
                <Stack direction="column" alignContent="center" >
                  <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Min</Typography>
                  <TextField  type="number" disabled  />
                </Stack>

                  <Stack direction="column" alignContent="center">
                    <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Max</Typography>
                    <TextField type="number" value={max} onChange={handleChangeMaximum}/>
                  </Stack>
              </Stack>
              
            </Grid>
            <Grid item xs={6} sx={{display:"flex", flexDirection:'column'}} >

            <Stack direction="column" alignContent="center">
              <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Slots</Typography>
              <MultipleSelectChip
                dataMultSelect={slots}
                labelMultSelect=""
                placeholderMultSelect=""
                onHandleChange={handleChangeSlot}
              />
            </Stack>
            
            <Stack direction="column" alignContent="center" sx={{ marginTop: '20px'}}>
              <Typography 
                variant="subtitle1"
                align="inherit"
                mb ={1}
                ml={1.5}
                sx={{color:'#919EAB'}}
              >
                Times
              </Typography>
              <MultipleSelectChip 
                dataMultSelect={teams}
                labelMultSelect=""
                placeholderMultSelect=""
                onHandleChange={handleChangeTeam}
              />
            </Stack>
            
            <Stack direction="column" alignContent="center" sx={{ width: '90%', marginTop: '20px'}}>
              <Typography variant="subtitle1" align="inherit" mb ={1} ml={1.5} sx={{color:'#919EAB'}}>Modo de Jogo</Typography>
                <Select
                  value={mode}
                  onChange={handleChangeMode}
                >
                <MenuItem value='H'>Home</MenuItem>
                <MenuItem value='A'>Away</MenuItem>
              </Select>
            </Stack>

              <Button startIcon={<SaveAs/>} sx={{width: '15%', position:'absolute', bottom:'15px', right:'70px'}}variant="outlined" type="submit" >Salvar</Button>

            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>  
  )
}