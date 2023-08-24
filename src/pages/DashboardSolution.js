import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import {Button,ButtonGroup, Paper, Chip} from '@mui/material';
import {DeleteOutline, Event} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader';
import toast from '../utils/toast';
import { delay ,fDateTimeSuffix} from "../utils/formatTime";
import DataGrid from '../components/DataGrid';
import Dialog from '../components/Dialog';
import { LeagueContext } from '../hooks/useContextLeague';
import {get} from '../services/requests';


import api from '../services/api';


export default function DashboardSolution() {
  const {t} = useTranslation();
  const [listSolutions, setListSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState([])
  const navigate = useNavigate();
  const theme = useTheme();
  const {currentLeague, solutionExists, setValueStatusSolution} = useContext(LeagueContext);
  const [openDialog, setOpenDialog] = useState(false);

  const COLORS = {
    
    'not': "#ECECEC",
    'active' : '#54D62C',
    'outdated' : '#FFC107',
    '...processing' : '#3366FF'
  }

  const COLORS_TEXT = {
    'not': "#ECECEC",
    'active' : '#54D62C',
    'outdated' : '#FFC107',
    '...processing' : '#3366FF'
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
      field: 'status',
      headerName: t('labelStatus'),
      width: 680,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const { value: status } = params;
        const backgroundColor = status === 'outdated' ? COLORS.outdated : COLORS.active;
        return (
          <Chip
            label={(status)}
            style={{ backgroundColor, fontWeight: 'bold'  }}
          />
        );
      }
    },

    {
      field: 'criado_em',
      valueFormatter: (params) => fDateTimeSuffix(params.value),
      headerName:t('headTableCreated'),
      width: 600,
      headerAlign: 'center',
      align: 'center'
    }
  ]

  const handleRowClick = async (params) => {
    const {id} = params;
    navigate(`/dashboard/result/${id}`)
  }

  const handleDelete = async () => {
    try{
      arrayIds.map(async (a) => {
        await api.delete(`solution/${a}`)
        setValueStatusSolution('not')
        
      })
      setOpenDialog(false);
      setListSolutions(prevSolutions => prevSolutions.filter(solution => !arrayIds.includes(solution.id)));
      setIsLoading(true)
      await delay(700)
      toast({
        type: 'success',
        text: t('toastSuccess'),
      })
    } catch(e) {
      setIsLoading(false)
      toast({
        type: 'error',
        text: t('toastError')
      })
    } finally{
      setIsLoading(false)
    }
  }
  const handleResult = async () => {
    try{
        setIsLoading(true)
        await delay(300);
        await get(`/archive/${currentLeague.id}`);
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
      <Loader isLoading={isLoading}/>
      <Dialog 
        open={openDialog}
        title={t('alertTitle')}
        contentMessage={t('alertDeleteInstance')}
        onClickAgree={handleDelete}
        onClickDisagree={() => setOpenDialog(false)}
      />

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
          onClick={() => setOpenDialog(true)}
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