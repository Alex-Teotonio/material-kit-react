import { useEffect , useState } from "react";
import { Avatar, Card, Container,IconButton, Stack, Typography } from "@mui/material";
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
import setRandomColor from '../components/color-utils/ColorsAleatory'

// import EditTable from '../components/Table';


export default function Teams() {


  const {t} = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState();
  const [teamSelected, setTeamSelected] = useState({});

  
  const columns = [
    { 
      field: '',
      renderCell: (cellValues) => (
        <Stack>
          <Avatar 
            key={cellValues.row.id}
            sx={{backgroundColor: setRandomColor()}}
            sizes="20"
            src={cellValues.row?.url}
            children={<small>{cellValues.row?.initials}</small>}
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

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

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
    await delay(500)
    const response = await loadTeams(currentLeague.id);
    setTeams(response);
  };

    return (

      <>
        <Page >
          <Container maxWidth='xl'>
          <Modal titleModal="Teams" descriptionModal="Edit Team" isOpen={isOpenModal} onRequestClose={handleClose}>
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