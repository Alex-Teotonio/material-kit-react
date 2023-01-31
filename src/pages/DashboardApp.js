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
import {LeagueContext} from '../hooks/useContextLeague';

import DataGrid from '../components/DataGrid'
// @mui
// components
import Page from '../components/Page';
import Modal from '../components/Modal';
import Form from '../components/FormLeague';
import AppBar from '../components/AppBar';
import Dialog from '../components/Dialog';
import Toast from '../components/Toast';

import api from '../services/api';

export default function DashboardApp() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState(false);
  const [dataSelected, setDataSelected] = useState({})
  const [leagues, setLeagues] = useState([]);
  const [leaguesSelected, setLeaguesSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);


  const [openToast, setOpenToast] = useState(false);
  const [objectMessage, setObjectMessage] = useState({
    message: '',
    severity: ''
  });
  const {t} = useTranslation();
  const {saveCurrentLeague} = useContext(LeagueContext)

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
      const token = localStorage.getItem('token')
      if(token) {
        api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      }
      const response = await api.get('/league');
      setLeagues(response.data);
    }
    loadInstances()

  },[]
  )

  const handleOpen = () =>  {
    setIsOpenModal(true);
  }

  const updateLeague = async (newLeague) => {
    handleSucces('Instância adicionada com sucesso!')
    if(newLeague) setLeagues([...leagues, newLeague]);
  }

  const handleChangeLeague = (row) => {
    setDataSelected(row)
    setIsOpenChangeModal(true)
  }
  const renderUpdateLeague = (newLeague) => {
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
    setLeagues(leagues)
  }

  const handleClickCheckbox = (arrayLeaguesSelected) => {
    setLeaguesSelected(arrayLeaguesSelected)
  }

  const handleClickSelected = () => {}

  const handleCloseToast = () => {
    setOpenToast(false)
  }

  const handleError = ()  => {
    setObjectMessage({
      message: 'Não foi possível realizar a operação!',
      severity: 'error'
    })
    setOpenToast(true);
  }

  const handleSucces = (text)  => {
    setObjectMessage({
      message: text,
      severity: 'success'
    })
    setOpenToast(true);
  }
  
  const handleDeleteLeague = async () => {
    try {
      leaguesSelected.map(async (idLeague) => {
        await api.delete(`/league/${idLeague}`);
      })
      const leaguesFilter = leagues.filter(object => !leaguesSelected.some(toDelete => toDelete === object.id));
      setOpenDialog(false)
      setLeagues(leaguesFilter);
      setObjectMessage({
        message: 'Instância deletada com sucesso!',
        severity: 'success'
      })
      setOpenToast(true);
    } catch(error) {
      setObjectMessage({
        message: 'Não foi possível realizar a operação!',
        severity: 'error'
      })
      setOpenToast(true);
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
        <Dialog 
          open={openDialog}
          title="Alerta"
          contentMessage=' A instância será excluída permanentemente.Deseja continuar?'
          onClickAgree={handleDeleteLeague}
          onClickDisagree={() => setOpenDialog(false)}
        />
        <Toast 
          open={openToast}
          onHandleClose={handleCloseToast}
          message={objectMessage.message}
          severity={objectMessage.severity}
        />
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
            rowsData={leagues}
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
