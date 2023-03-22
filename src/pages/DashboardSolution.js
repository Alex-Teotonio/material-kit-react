import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import {Button,ButtonGroup, Paper, Box, IconButton, Typography} from '@mui/material';
import {DeleteOutline, Event,InfoOutlined} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { delay } from "../utils/formatTime";
import DataGrid from '../components/DataGrid';
// import Chip from '../components/Chip';
import { LeagueContext } from '../hooks/useContextLeague';
import {get} from '../services/requests';



import api from '../services/api';

export default function DashboardSolution() {
  const {t} = useTranslation()
  const [listSolutions, setListSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState([])
  const navigate = useNavigate();
  const theme = useTheme();
  const {currentLeague, solutionExists, setValueStatusSolution} = useContext(LeagueContext);

  const COLORS = {
    'not': "#ECECEC",
    'active' : '#E9FCD4',
    'outdated' : '#FFF7CD',
    '...processing' : '#D6E4FF'
  }

  const COLORS_TEXT = {
    'not': "#ECECEC",
    'active' : '#54D62C',
    'outdated' : '#FFC107',
    '...processing' : '#3366FF'
  }

  const STATUS_MESSAGES = {
    "active": "Solução atualizada - A última solução que você gerou está consistente com os dados apresentados no sistema. Clique na linha correspondente a atualização que você deseja ver o resultado.",
  "outdated": "Solução desatualizada - clique no botão abaixo para gerar uma nova solução consistente com os dados atuais da liga",
  "...processing": "Processando"
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

  const [arrayIds, setArrayIds] = useState([]);

  const columns =   [
    {
      field: 'name',
      headerName: t('labelSolutions'),
      width: 680, 
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params) => {
        const { value: name } = params;
        return name.slice(0, -4);
      }
    },

    {

      field: 'criado_em',
      headerName:t('headTableCreated'),
      width: 600,
      headerAlign: 'center',
      align: 'center'
    }
  ]

  const handleRowClick = async () => {
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
        setIsLoading(true)
        await delay(300);
        setValueStatusSolution('...processing');
        await get(`/archive/${currentLeague.id}`);
        setValueStatusSolution('active');
        await delay(50);
        navigate('/dashboard/result')
    } catch(e) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }
  const handleClickCheckbox = (id) => {
    setArrayIds(id)
  }
  return (
    <> 
    {
      listSolutions.length > 0 && (
        <Box sx={{ 
          bgcolor: `${COLORS[solutionExists]}`,
          color: 'blue',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
          }}>
          <IconButton sx={{ color: `${COLORS_TEXT[solutionExists]}` }}>
            <InfoOutlined />
          </IconButton>
          <Typography variant="body1" sx={{ marginLeft: '4px', color: `${COLORS_TEXT[solutionExists]}` }}>
            {STATUS_MESSAGES[solutionExists]}
          </Typography>
        </Box>
      
    )}

    <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
        <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
          <Button>{t('labelSolutions')}</Button>
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
          {t('buttonDelete')}
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
          <span>{t('buttonGenerate')}</span>
        </LoadingButton>
      </Paper>
    </>
  )
}