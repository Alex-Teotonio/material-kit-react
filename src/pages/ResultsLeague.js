import { useState, useEffect } from 'react';
import {useTranslation} from 'react-i18next'
import {Avatar,Button,Card,Divider, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow  } from '@mui/material';
import LinearProgress  from '../components/LinearProgress';
import Iconify from '../components/Iconify';
import AppBar from '../components/AppBar';


import api from '../services/api';
import {get} from '../services/requests';

import DataGrid from '../components/DataGrid'

import {delay} from '../utils/formatTime'

export default function Result() {

  const [file, setFile] = useState([]);
  const [teams, setTeams] = useState([])
  const [slots, setSlots] = useState([])
  
  const [isLoading, setIsLoading] = useState(false)

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

  const columns = [
    slots.map((s) => ({
      field: s.name,
      headerderName: s.name
    })),
    { field: 'Home', renderCell: (cellValues) => {
      const teamFind = teams.find((team) => parseInt(cellValues.row.home,10) === team.publicid)
        return (
            <>
                <Typography>{teamFind?.name}</Typography>
            </>
        )
      
    }, width: 380, headerAlign: 'center', align: 'center' },
    { field: 'Away', renderCell: (cellValues) => {
      const teamFind = teams.find((team) => parseInt(cellValues.row.away,10) === team.publicid)
        return (
            <>
                <Typography>{teamFind?.name}</Typography>
            </>
        )
      
    },headerAlign: 'center', align: 'center', width: 380 },
    { field: 'Slot', renderCell: (cellValues) => {
      const slotFind = slots.find((slot) => parseInt(cellValues.row.slot,10) === slot.publicid)
        return (
            <>
                <Typography>{slotFind?.name}</Typography>
            </>
        )
      
    }, width: 280,headerAlign: 'center', align: 'center' },
  ]

  console.log(columns)

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const arrayWrite = [];
  const render  = null;

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
        {/* <DataGrid columnData={columns} rowsData={file} /> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time/Rodada</TableCell>
              <Divider orientation="vertical" sx={{borderColor: 'red', borderWidth: '10px'}} flexItem />
                {
                  slots.map((slot) => (
                      <TableCell key={slot.id}>{slot.name}</TableCell>
                    ))
                }
            </TableRow>
            {
              teams.map((team) => {
                const render =  <TableRow key={team.id}>
                    <TableCell key={team.id}>{team.name}</TableCell>
                    {
                      slots.map((s) => {
                        const tst =  file.find((f) => (+f.home) ===  (team.publicid) && (+f.slot) === (s.publicid));
                        const gameTeam = teams.find((t) => (t.publicid) ===  +tst?.away);
                        console.log(gameTeam)
                        const renderCell =  <TableCell>{gameTeam?.name}</TableCell>
                        return renderCell
                      })

                    }
                </TableRow>
              
              return render
              })
          }
          </TableHead>
        </Table>
      </Card>
    <div />
    </>
  )

}