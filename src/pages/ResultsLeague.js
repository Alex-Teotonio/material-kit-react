import { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/styles";
import {useTranslation} from 'react-i18next'
import {Card, Table, TableCell, TableHead, TableRow  } from '@mui/material';
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
  const [slots, setSlots] = useState([])
  
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const {t} = useTranslation(); 

  useEffect(() => {
    async function getSolution(){
      try{
        setIsLoading(true);
        await delay(700)
        const solutions = await get(`/findSolution/${currentLeague.id}`);
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
      <Card >
        <AppBar titleAppBar="Games"/>
        <Loader isLoading={isLoading}/>

        <Games data={file} slots={slots} teams={teams}/>
      </Card>
    <div />
    </>
  )

}