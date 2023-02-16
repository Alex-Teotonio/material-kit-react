import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import {Button,ButtonGroup, Paper } from '@mui/material';
import {DeleteOutline, Event} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { delay } from "../utils/formatTime";
import DataGrid from '../components/DataGrid';
import Chip from '../components/Chip';
import { LeagueContext } from '../hooks/useContextLeague';
import {get} from '../services/requests';



import api from '../services/api';

export default function DashboardSolution() {
  const [listSolutions, setListSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState([])
  const navigate = useNavigate();
  const theme = useTheme();
  const {currentLeague, solutionExists, setValueStatusSolution} = useContext(LeagueContext);

  const COLORS = {
    'not': "error",
    'active' : 'success',
    'outdated' : 'warning',
    '...processing' : 'warning'
  }

  useEffect(() => {
    async function loadSolutions() {
      try{
        setIsLoading(true)
        const response = await get(`/loadSolutions/${currentLeague.id}`)
        setListSolutions(response)
      } catch(e) {
        console.log(e);
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
    loadSolutions();
    },
  [currentLeague]);

  const [arrayIds, setArrayIds] = useState([])
  const columns =   [
    {
      field:'name', headerName: 'Solutions', width: 500,  headerAlign: 'center', align: 'center'
    },
    {

      field: 'status', renderCell: () => (<div><Chip color={COLORS[solutionExists]}  label={solutionExists}/></div>),  width: 450,  headerAlign: 'center', align: 'center'
    }
  ]

  const handleRowClick = async (params) => {
    navigate(`/dashboard/result`)
  }

  const handleDelete = async () => {
    arrayIds.map(async (a) => {
      await api.delete(`solution/${a}`)
      setValueStatusSolution('not')
      return[]
    })
  }

  const handleResult = async () => {
    try{
      // if(solutionExists !== 'active'){
        setIsLoading(true)
        await delay(300);
        setValueStatusSolution('...processing');
        await get(`/archive/${currentLeague.id}`);
        setValueStatusSolution('active');
        await delay(50);
        navigate('/dashboard/result')
      // }
    } catch(e) {
      setIsLoading(false)
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  const handleClickCheckbox = (id) => {
    setArrayIds(id)
  }
  return (
    <> 
    <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
        <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
          <Button>Soluções</Button>
        </ButtonGroup>
        <DataGrid columnData={columns} rowsData={listSolutions} onHandleRowClick={handleRowClick} onHandleCheckbox={handleClickCheckbox}/>
      { arrayIds.length > 0 && (
        <Button 
          variant="contained"
          startIcon={<DeleteOutline/>}
          sx=
          {{
            marginTop:'20px',
            height: '30px',
            float: 'right',
            marginRight: '4px',
            backgroundColor: theme.palette.error.main
          }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}



        <LoadingButton
          size="large"
          color="secondary"
          onClick={handleResult}
          loading={isLoading}
          loadingPosition="end"
          startIcon={<Event />}
          variant="contained"
          sx=
          {{
            marginTop:'20px',
            height: '30px',
            float: 'right',
            marginRight: '4px',
            backgroundColor: theme.palette.primary.main
          }}
        >
          <span>Gerar</span>
        </LoadingButton>
      </Paper>
    </>
  )
}