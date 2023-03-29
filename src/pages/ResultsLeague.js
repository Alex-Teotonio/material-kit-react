import { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/styles";
import { useParams, useNavigate } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import {Button,ButtonGroup,Paper } from '@mui/material';
import AppBar from '../components/AppBar';
import {get} from '../services/requests';
import Loader from '../components/Loader';
import Games from '../components/Games'

import {delay} from '../utils/formatTime'


const useStyles = makeStyles(() => ({
  tableContainer: {
    maxWidth: "150vh",
    margin: "auto",
    marginTop: "15vh",
    height: "70vh",
    background: "#ccffff",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid",
  },
  table: {
    height: "70vh"
  },

  tableCell: {
    borderRight: "1px solid rgba(241,243,244,1)"
  }
}));

export default function Result() {

  const [file, setFile] = useState([]);
  const [teams, setTeams] = useState([])
  const [slots, setSlots] = useState([]);

  const {id} = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation(); 

  useEffect(() => {
    async function getSolution(){
      try{
        setIsLoading(true);
        await delay(700)

        const path = id? `/findSolutionById/${id}`: `findSolution/${currentLeague.id}`
        const solutions = await get(path);
        const dataTeams = await get(`/team/${currentLeague.id}`);
        const dataSlots = await get(`/slot/${currentLeague.id}`);
        setTeams(dataTeams);
        setSlots(dataSlots)

        const newSolution = solutions.map((s) => {
          const row = s.$;
          row.id = Math.floor(Math.random() * 500)
          return row
        })
        setFile(newSolution)
      } catch(e) {
        setIsLoading(false);
      } finally {
        setIsLoading(false)
      }
    }
    getSolution();
  },[]);

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const handleResult = async () => {
      setIsLoading(true)
      const solutions = await get(`/archive/${currentLeague.id}`);
      const dataTeams = await get(`/team/${currentLeague.id}`);
      setTeams(dataTeams);
      const dataSlots = await get(`/slot/${currentLeague.id}`);
      setSlots(dataSlots)

      const newSolution = solutions.map((s) => {
        const row = s.$;
        row.id = Math.floor(Math.random() * 50)
        return row
      })
      setFile((newSolution))
  }

  return (
    <>
     <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
      <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
        <Button>Games</Button>
      </ButtonGroup>
        <Loader isLoading={isLoading}/>
        <Games data={file} slots={slots} teams={teams}/>
      </Paper>
    </>
  )

}