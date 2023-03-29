import { useContext, useEffect , useState } from "react";
import { Avatar, Card, Container,IconButton, Stack } from "@mui/material";
import {useTranslation} from "react-i18next"
import {EditOutlined} from '@mui/icons-material'
import Page from "../components/Page";
import DataGrid from '../components/DataGrid';
import { loadTeams} from "../services/requests";
import AppBar from '../components/AppBar';
import Modal from '../components/Modal';
import FormTeams from "../components/FormTeams";
import { delay } from '../utils/formatTime'
import api from '../services/api';
import Loader from '../components/Loader';
import { LeagueContext } from "../hooks/useContextLeague";
import toast from "../utils/toast";

// import EditTable from '../components/Table';


export default function Teams() {
  const {t} = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState();
  const [teamSelected, setTeamSelected] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [, setTeamColors] = useState({});
  const {currentLeague, teamColor, setTeamColor} = useContext(LeagueContext)

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('token')
      if(token) {
        api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      }
      const data = await loadTeams(currentLeague.id);

      const colors = {};
      data.forEach(team => {
        colors[team.id] = setTeamColor(team);
      });
      setTeamColors(colors);
      setTeams(data)
    }
    loadData();
  },[currentLeague.id, loadTeams, setTeamColor]);

  
  const columns = [
    { 
      field: '',
      renderCell: (cellValues) => (
        <Stack>
           <Avatar 
            key={cellValues.row.id}
            sx={{ width: 40, height: 40 }} // define um tamanho de 40x40 para o Avatar
            // style={cellValues.row?.url ? {} : { backgroundColor: `${teamColor[cellValues.row?.id]}` }}
            src={cellValues.row?.url}
            children={!cellValues.row?.url ? <small>{cellValues.row?.initials}</small> : null}
          />

          
        </Stack>
      ), 
      width: 20,
      headerAlign: 'left',
      align: 'left'
    },
    { field: 'name', headerName: t('headTableNameTeams'), width: 300, headerAlign: 'left', align: 'left' , },
    { field: 'initials', headerName: t('headTableInitialsTeams'), width: 300,  headerAlign: 'left', align: 'left'  },
    { field: 'venue', headerName: t('headTableVenueTeams'), width: 250,  headerAlign: 'left', align: 'left'  },
    {field: "Actions",
            renderCell: (cellValues) => (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickModal(cellValues.row)}
                >
                  <EditOutlined color="primary" />
                </IconButton> 
            ),
            width: 250,
             headerAlign: 'center', align: 'center' 
        },
  ];
  const [teams, setTeams] = useState([]);

  useEffect(
    () => {
      async function loadData() {
        const token = localStorage.getItem('token')
        if(token) {
          api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
        }
        const data = await loadTeams(currentLeague.id);
        setTeams(data.map(row => (
          {...row, isEditMode: false}
        )))
      }
      loadData();
    }
  ,[currentLeague.id]);


  const handleClickModal = (row) =>  {
    const leagueId = row.league_id
    const {id, name, initials, venue, url} = row;
    setTeamSelected({id, name, leagueId, initials, venue, url})
    setIsOpenModal(true)
  }

  const handleClose = () => {
    setIsOpenModal(false)
  }

  const updatedTeams = async () => {
    try {
      setIsLoading(true)
      await delay(700)
      const response = await loadTeams(currentLeague.id);
      setTeams(response);
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
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  };

    return (

      <>
        <Page >
          <Container maxWidth='xl'>
            <Loader isLoading={isLoading}/>
          <Modal titleModal={t('headTableNameTeams')} descriptionModal="" isOpen={isOpenModal} onRequestClose={handleClose}>
            <FormTeams data={teamSelected} onRequestCloseModal={handleClose} onHandleTeams={updatedTeams}/>
          </Modal>
          <Card>
            <AppBar titleAppBar={t('headTableNameTeams')}/>
          <DataGrid columnData={columns} rowsData={teams} />
            {/* <EditTable/> */}
            </Card>
          </Container>
        </Page>
        </>

    );
}