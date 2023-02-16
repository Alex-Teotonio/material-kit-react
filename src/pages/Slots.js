import { useEffect, useState, useCallback } from 'react';
import {Button,ButtonGroup,Paper } from '@mui/material';
import { AccessTimeTwoTone } from "@mui/icons-material";
import {useTranslation} from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { delay } from '../utils/formatTime';
import toast from '../utils/toast';

import Loader from '../components/Loader'
import {get, put } from '../services/requests';
// import Calendar from '../layouts/dashboard/Calendar';

export default function Slots() {
    
    const [slots, setSlots] = useState([]);
    const {t} = useTranslation();
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);
    const [isLoading, setIsLoading] = useState(false)

    const columns  =  [
      { 
        field: 'name',
        headerName: t('headTableNameSlots'),
        width: 500, 
        headerAlign: 'center',
        align: 'center',
        editable: true,
      },
      { 
        field: 'criado_em',
        headerName: 'Atualizado em',
        width: 500, 
        headerAlign:'center',
        align: 'center' 
      }
        
    ];
    useEffect(
        () => {
          async function fetchData() {
            const data = await get(`/slot/${currentLeague.id}`);
            setSlots(data)
          }
  
          fetchData();
        }
      ,[currentLeague.id]);

      const handleRowError = useCallback((error) => {
        console.log(error)
          toast({
            type: 'error',
            text: 'Houve um erro ao atualizar '
          })
        }
      ,[])

      const onHandleProcessUpdate = useCallback(
        async (newRow) => {
          try {
            setIsLoading(true)
            await delay(300)
            const {id, name, league_id} = newRow
            const leagueId = league_id
            await put(`/slot/${id}`, {name, leagueId});
            toast({
              type: 'success',
              text: 'Atualizado com sucesso!'
            })
          } catch {
            setIsLoading(false)
          } finally {
            setIsLoading(false)
          }
        },
        [],
      );
      
    return (
      <>
    <Paper square sx={{width: '100%', padding: '5px', height:'400px'}} >
      <Loader isLoading={isLoading} />
      <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
        <Button startIcon={<AccessTimeTwoTone/>}>Slots</Button>
      </ButtonGroup>
      {slots && slots.length > 0 &&
        <DataGrid
          columns={columns}
          rows={slots} 
          getRowId={(row) => row.id ? row.id : ""}
          processRowUpdate={onHandleProcessUpdate}
          onProcessRowUpdateError={handleRowError}
        />
      }
      {/* <Calendar/> */}
    </Paper>
  </>
    )
}