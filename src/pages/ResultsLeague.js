import { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/styles";
import {useTranslation} from 'react-i18next'
import {Avatar,Button,Card,Divider, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow  } from '@mui/material';
import LinearProgress  from '../components/LinearProgress';
import Iconify from '../components/Iconify';
import AppBar from '../components/AppBar';

import api from '../services/api';
import {get} from '../services/requests';


const useStyles = makeStyles(() => ({
  tableContainer: {
    maxWidth: "150vh",
    margin: "auto",
    marginTop: "15vh",
    height: "70vh",
    background: "#ccffff",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid"
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
        const solutions = await get(`/findSolution/${currentLeague.id}`);
        const dataTeams = await get(`/team/${currentLeague.id}`);
        const dataSlots = await get(`/slot/${currentLeague.id}`);
        setTeams(dataTeams);
        setSlots(dataSlots)

        const newSolution = solutions.map((s) => {
          const row = s.$;
          row.id = Math.floor(Math.random() * 500)
          return row        })
        setFile(newSolution)
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
      <Stack direction="row" alignContent="center" alignItems="center" spacing={2} mb={4}>
        <LinearProgress isLoading={isLoading}/>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{height: '30px',width: '20%'}}
          onClick={handleResult}
        >
          Gerar
        </Button>
      </Stack>
      {/* <Toast 
            open={objectMessage.open}
            onHandleClose={()=> setObjectMessage({
              open: false
            })}
            message={objectMessage.message}
            severity={objectMessage.severity}
          /> */}
      <Card>
        <AppBar titleAppBar="Calendar"/>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell}>Time/Rodada</TableCell>
                {
                  slots.map((slot) => (
                      <TableCell className={classes.tableCell} key={slot.id}>{slot.name}</TableCell>
                    ))
                }
            </TableRow>

          </TableHead>
            {
              teams.map((team) => {
                const render =  <TableRow key={team.id}>
                    <TableCell sx={{fontWeight: 'bold'}} className={classes.tableCell} key={team.id}>{team.name}</TableCell>
                    {
                      slots.map((s) => {
                        const tst =  file.find((f) => (+f.home) ===  (team.publicid) && (+f.slot) === (s.publicid));
                        const gameTeam = teams.find((t) => (t.publicid) ===  +tst?.away);
                        const renderCell =  <TableCell className={classes.tableCell}>{gameTeam?.name}</TableCell>
                        return renderCell
                      })

                    }
                </TableRow>
              
              return render
              })
          }
        </Table>
      </Card>
    <div />
    </>
  )

}