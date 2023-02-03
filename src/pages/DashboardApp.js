import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import {
  Button,
  Grid,
  Card,
  IconButton,
  Stack,
  Container,
 CssBaseline } from '@mui/material';
 

import { DeleteOutlineOutlined, EditOutlined, AddOutlined } from '@mui/icons-material';
import { delay } from '../utils/formatTime';
 import Loader from '../components/Loader'

import {LeagueContext} from '../hooks/useContextLeague';

import DataGrid from '../components/DataGrid'
// @mui
// components
import Page from '../components/Page';
import Modal from '../components/Modal';
import Form from '../components/FormLeague';
import AppBar from '../components/AppBar';
import Dialog from '../components/Dialog';
import Snackbar from '../components/SnackBar'

import api from '../services/api';
import {get} from '../services/requests'

export default function DashboardApp() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState(false);
  const [dataSelected, setDataSelected] = useState({})
  const [leagues, setLeagues] = useState([]);
  const [leaguesSelected, setLeaguesSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');


  const [openToast, setOpenToast] = useState(false);
  const {t} = useTranslation();
  const {handleAddLeaguesForUser,handleLeaguesForUser, saveCurrentLeague, leaguesToUser} = useContext(LeagueContext)

  const columns = [
    { field: 'name', headerName: t('headTableName'), width: 300, headerAlign: 'center', align: 'center' },
    { field: 'short', headerName: t('headTableShort'), width: 230, headerAlign: 'center', align: 'center' },
    { field: 'number_teams', headerName: t('headTableNumberTeams'), width: 230, headerAlign: 'center', align: 'center' },
    { field: 'Actions', 
    renderCell: (cellValues) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton size='small' color="primary" onClick={() => handleChangeLeague(cellValues.row)}>
          <EditOutlined/>
        </IconButton>
      </Stack>
    ),
    width: 280,
    headerAlign: 'center',
    align: 'center' 
    },
  ]
  useEffect(() => {
    async function loadInstances() {
      try {
        setIsLoading(true)
        const response = await get('/league');
        setLeagues(response);
      } catch(e) {
        console.log(e)
      }finally {
        setIsLoading(false)
      }
    }
    loadInstances()

  },[]
  )

  const handleOpen = () =>  {
    setIsOpenModal(true);
  }

  const updateLeague = async (newLeague) => {
    try {
      setIsLoading(true)
      await delay(700)
      handleSucces('Instância adicionada com sucesso!');
      if(newLeague) handleAddLeaguesForUser(newLeague);
    } catch(e) {
      console.log(e)
      setIsLoading(false)   
    }finally{
      setIsLoading(false)
    }
  }

  const handleChangeLeague = (row) => {
    setDataSelected(row)
    setIsOpenChangeModal(true)
  }
  const renderUpdateLeague = async (newLeague) => {
    try {
      setIsLoading(true)
      await delay(700)
      leagues.map((league) => {
        if(league.id === newLeague.id) 
        {
          league.name = newLeague.name;
          league.roud_robin = newLeague.roud_robin
          league.mirred = newLeague.mirred
          league.number_teams = newLeague.number_teams
          league.short = newLeague.short
        }
        return league
      })
      handleSucces('Instância atualizada com sucesso!')
      handleLeaguesForUser(leagues)
    } catch(e) {
      console.log(e)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickCheckbox = (arrayLeaguesSelected) => {
    setLeaguesSelected(arrayLeaguesSelected)
  }

  const handleClickSelected = () => {}

  const handleError = ()  => {
    setMessage('Não foi possível realizar a operação!');
    setSeverity('error')
    setOpenToast(true);
  }

  const handleSucces = ()  => {
    setMessage('Operação efetuada com sucesso!');
    setSeverity('success');
    setOpenToast(true);
  }
  
  const handleDeleteLeague = async () => {
    try {
        leaguesSelected.map(async (idLeague) => {
        await api.delete(`/league/${idLeague}`);
      })
      const leaguesFilter = leagues.filter(object => !leaguesSelected.some(toDelete => toDelete === object.id));
      setOpenDialog(false);
      setIsLoading(true)
      await delay(700)
      handleLeaguesForUser(leaguesFilter)
      setLeagues(leaguesFilter);
      handleSucces()
    } catch(error) {
      setIsLoading(false)
      handleError();
    } finally{
      setIsLoading(false)
    }
  }
  const handleClose = () =>  {setIsOpenModal(false)}
  const handleCloseChangeModal = () =>  {setIsOpenChangeModal(false)}
  const handleRowClick = (params) => {
    saveCurrentLeague(params.row)
  }
  return (
    <Page title="Dashboard">
      <CssBaseline />
      <Container >
        <Loader isLoading={isLoading}/>
        <Dialog 
          open={openDialog}
          title="Alerta"
          contentMessage=' A instância será excluída permanentemente.Deseja continuar?'
          onClickAgree={handleDeleteLeague}
          onClickDisagree={() => setOpenDialog(false)}
        />
        {<Snackbar open={openToast} message={message} severity={severity} onHandleClose={() => setOpenToast(false)}/>}
        <Modal titleModal="Edit League" descriptionModal="Edit your League" isOpen={isOpenChangeModal} onRequestClose={handleCloseChangeModal}>
          <Form onRequestClose={handleCloseChangeModal} onHandleLeague={renderUpdateLeague} data={dataSelected} onError={handleError}/>
        </Modal>
        <Modal titleModal={t('titleModalLeague')} descriptionModal= {t('descriptionModalLeague')} isOpen={isOpenModal} onRequestClose={handleClose}>
          <Form onRequestClose={handleClose} onHandleLeague={updateLeague} onError={handleError}/>
        </Modal>

        <Grid container spacing={3} />
        <Card>
          <AppBar titleAppBar={t('leagueDashboard')}/>
          <DataGrid 
            columnData={columns}
            rowsData={leaguesToUser}
            onHandleCheckbox={handleClickCheckbox}
            onHandleClickSelected={handleClickSelected}
            onHandleRowClick={handleRowClick}
          />
        </Card>
        <Button 
        variant="contained"
        startIcon={<AddOutlined/>}
        sx={{marginTop:'20px', height: '30px', float: 'right',marginRight: '4px'}}
        onClick={handleOpen}
      >
        {t('buttonAdd')}
      </Button>

      <Button 
        variant="contained"
        startIcon={<DeleteOutlineOutlined />}
        sx={{marginTop:'20px', height: '30px', float: 'right',marginRight: '4px'}}
        color="error"
        onClick={() => setOpenDialog(true)}
        disabled={leaguesSelected.length === 0}
      >
        {t('buttonDelete')}
      </Button>
      </Container>
    </Page>
  );
}
