import { useEffect, useState } from 'react';
import {Card, Container, IconButton} from '@mui/material';
import {EditOutlined } from "@mui/icons-material";
import {useTranslation} from 'react-i18next'
import DataGrid  from '../components/DataGrid';


import {loadSlots} from '../services/requests';
import AppBar from '../components/AppBar';
import api from '../services/api'
// import Calendar from '../layouts/dashboard/Calendar';

export default function Slots() {
    
    const [slots, setSlots] = useState([]);
    const {t} = useTranslation();
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);

    const columns  =  [
        { field: 'name', headerName: t('headTableNameSlots'), width: 500,  headerAlign: 'center', align: 'center' },
        {
        field: "Actions",
            renderCell: (cellValues) => (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleClickModal(cellValues.row)}
                >
                  <EditOutlined color="primary" />
                </IconButton> 
            ),
            width: 500,
             headerAlign: 'center', align: 'center' 
        },
        
    ];

    const handleClickModal = (row) => {
      }

    useEffect(
        () => {
          async function fetchData() {
            const token = localStorage.getItem('token')
            if(token) {
                api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      }
            const data = await loadSlots(currentLeague.id);
            setSlots(data)
          }
  
          fetchData();
        }
      ,[currentLeague.id]);

      console.log(slots)
    return (
        <>
        <Container maxWidth='lg'>
            <Card>
                <AppBar titleAppBar={t('headTableNameSlots')}/>
                <DataGrid columnData={columns} rowsData={slots} />
            </Card>
        </Container>
            {/* <Calendar/> */}
        </>
    )
}