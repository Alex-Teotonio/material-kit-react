import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, IconButton } from '@mui/material';
import {DeleteOutline, AddOutlined} from '@mui/icons-material'
import DataGrid from '../components/DataGrid';
import Chip from '../components/Chip'

import {get} from '../services/requests';
import AppBar from '../components/AppBar';

export default function DashboardSolution() {
 
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const [listSolutions, setListSolutions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSolutions() {
      const response = await get(`/loadSolutions/${currentLeague.id}`)
      console.log(listSolutions)
      setListSolutions(response)
    }
    loadSolutions();
    },
  [])
  const columns =   [
    {
      field:'name', headerName: 'Solutions', width: 500,  headerAlign: 'center', align: 'center'
    },
    {

      field: 'status', renderCell: () => (<div><Chip color='success' label='Active'/></div>),  width: 250,  headerAlign: 'center', align: 'center'
    },

    {

      field: 'Action', renderCell: () => (<
        IconButton
        aria-label="delete"
      >
        <DeleteOutline color="primary" />
      </IconButton>),  width: 250,  headerAlign: 'center', align: 'center'
    }
  ]

  const handleRowClick = (params) => {

    navigate(`/dashboard/result`)
}
  return (
    <> 
      <Container>
        <Card>
        <AppBar titleAppBar='Solutions'/>
        <DataGrid columnData={columns} rowsData={listSolutions} onHandleRowClick={handleRowClick}/>
        </Card>
        <Button 
        variant="contained"
        startIcon={<AddOutlined/>}
        sx={{marginTop:'20px', height: '30px', float: 'right',marginRight: '4px'}}
      >
        Gerar
      </Button>
        
      </Container>
    </>
  )
}