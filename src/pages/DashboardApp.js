import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  IconButton,
  Stack 
} from '@mui/material';

import {
  DeleteOutlineOutlined,
  EditOutlined, AddOutlined,FileCopyOutlined } from '@mui/icons-material';
import {get} from '../services/requests'
import Carousel from '../components/Carousel';
import { delay } from '../utils/formatTime';
 import Loader from '../components/Loader'

import {LeagueContext} from '../hooks/useContextLeague';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid'
// @mui
// components
import Page from '../components/Page';
import Modal from '../components/Modal';
import Dialog from '../components/Dialog';

import api from '../services/api';


import AddLeagueForm from './AddLeagueForm';
import EditLeagueForm from './EditLeagueForm';

export default function DashboardApp() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangeModal, setIsOpenChangeModal] = useState(false);
  const [dataSelected, setDataSelected] = useState({})
  const [leagues, setLeagues] = useState([]);
  const [leaguesSelected, setLeaguesSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();
  const {
    handleAddLeaguesForUser,
    handleLeaguesForUser,
    saveCurrentLeague,
    leaguesToUser,
    currentLeague,
    removeCurrentLeague
  } = useContext(LeagueContext)

  const columns = [
    { field: 'name', headerName: t('headTableName'), width: 400, headerAlign: 'center', align: 'center' },
    { field: 'short', headerName: t('headTableShort'), width: 330, headerAlign: 'center', align: 'center' },
    { field: 'number_teams', headerName: t('headTableNumberTeams'), width: 330, headerAlign: 'center', align: 'center' },
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

  const handleCopy = async() => {
    try {

      setIsLoading(true)
      await delay(700)
      const { data } = await api.post(`/league_copy/${currentLeague.id}`);
      handleAddLeaguesForUser(data)
    }catch(e) {
      setIsLoading(false)
      toast({
        type: 'error',
        text: t('toastError')
      })
    } finally {
      setIsLoading(false)
    }
  }
  const updateLeague = async (newLeague) => {
    try {
      setIsLoading(true)
      await delay(700)
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
      if(newLeague) handleAddLeaguesForUser(newLeague);
    } catch(e) {
      toast({
        type: 'error',
        text: t('toastError')
      })
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
      const leagueUpdate = leagues.map((league) => {
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

      handleLeaguesForUser(leagueUpdate)
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
    } catch(e) {
      setIsLoading(false)
      toast({
        type: 'error',
        text: t('toastError')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickCheckbox = (arrayLeaguesSelected) => {
    setLeaguesSelected(arrayLeaguesSelected);
  }
  const handleClickSelected = (params) => {console.log(params)}
  
  const handleDeleteLeague = async () => {
    try {
        leaguesSelected.map(async (idLeague) => {
        await api.delete(`/league/${idLeague}`);
        removeCurrentLeague(idLeague)
      })
      const leaguesFilter = leagues.filter(object => !leaguesSelected.some(toDelete => toDelete === object.id));
      setOpenDialog(false);
      setIsLoading(true)
      await delay(700)
      handleLeaguesForUser(leaguesFilter)
      setLeagues(leaguesFilter);
      toast({
        type: 'success',
        text: t('toastSuccess')
      })
    } catch(error) {
      setIsLoading(false)
      toast({
        type: 'error',
        text: t('toasError')
      })
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
        <Loader isLoading={isLoading}/>
        <Dialog 
          open={openDialog}
          title={t('alertTitle')}
          contentMessage={t('alertDeleteInstance')}
          onClickAgree={handleDeleteLeague}
          onClickDisagree={() => setOpenDialog(false)}
        />
        <Modal 
          titleModal={t('editLeagueTitle')}
          descriptionModal={t('descriptionEditLeague')}
          isOpen={isOpenChangeModal}
          onRequestClose={handleCloseChangeModal}
        >
          <EditLeagueForm 
            onRequestClose={handleCloseChangeModal}
            onHandleLeague={renderUpdateLeague}
            data={dataSelected}
          />
        </Modal>
        <Modal
          titleModal={t('titleModalLeague')}
          descriptionModal= {t('descriptionModalLeague')}
          isOpen={isOpenModal}
          onRequestClose={handleClose}
        >
          <AddLeagueForm
            onRequestClose={handleClose}
            onHandleLeague={updateLeague}
          />
        </Modal>

        <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button>{t('instance')}</Button>
          </ButtonGroup>
          <DataGrid 
            columnData={columns}
            rowsData={leaguesToUser}
            onHandleCheckbox={handleClickCheckbox}
            onHandleClickSelected={handleClickSelected}
            onHandleRowClick={handleRowClick}
          />
        </Paper>
        <Button 
        variant="contained"
        startIcon={<AddOutlined/>}
        sx={{marginTop:'20px', height: '30px', float: 'right',marginRight: '4px'}}
        onClick={handleOpen}
      >
        {t('buttonAdd')}
      </Button>

      { leaguesSelected.length > 0 && (
        <>
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

        <Button 
          variant="contained"
          startIcon={<FileCopyOutlined />}
          sx={{marginTop:'20px', height: '30px', float: 'right',marginRight: '4px'}}
          onClick={handleCopy}
          disabled={leaguesSelected.length > 1}
        >
          {t('copy')}
        </Button>
        
        </>
      )}
    </Page>
  );
}
