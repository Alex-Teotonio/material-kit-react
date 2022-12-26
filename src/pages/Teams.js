import { useEffect , useState } from "react";
import { Card, Container,IconButton } from "@mui/material";
import {useTranslation} from "react-i18next"
import {EditOutlined} from '@mui/icons-material'
import Page from "../components/Page";
import DataGrid from '../components/DataGrid';
import { loadTeams} from "../services/requests";
import AppBar from '../components/AppBar';
import api from '../services/api'

// import EditTable from '../components/Table';


export default function Teams() {


  const {t} = useTranslation();
  const columns = [
    { field: 'name', headerName: t('headTableNameTeams'), width: 300, headerAlign: 'center', align: 'center' , },
    { field: 'initials', headerName: t('headTableInitialsTeams'), width: 300,  headerAlign: 'center', align: 'center'  },
    { field: 'venue', headerName: t('headTableVenueTeams'), width: 250,  headerAlign: 'center', align: 'center'  },
    {field: "Actions",
            renderCell: (cellValues) => (
                <IconButton
                  aria-label="delete"
                  // onClick={() => handleClickModal(cellValues.row)}
                >
                  <EditOutlined color="primary" />
                </IconButton> 
            ),
            width: 250,
             headerAlign: 'center', align: 'center' 
        },
  ];

  const [teams, setTeams] = useState([])

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
    return (
        <Page >
          <Container maxWidth='xl'>
          <Card>
            <AppBar titleAppBar={t('headTableNameTeams')}/>
          <DataGrid columnData={columns} rowsData={teams} />
            {/* <EditTable/> */}
            </Card>
          </Container>
        </Page>

    );
}