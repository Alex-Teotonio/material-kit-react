import 'regenerator-runtime/runtime';

import { useEffect, useState, useCallback, useContext } from 'react';
import {Button,ButtonGroup,Paper } from '@mui/material';
import { AccessTimeTwoTone } from "@mui/icons-material";
import {useTranslation} from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { LeagueContext } from "../hooks/useContextLeague";
import { delay } from '../utils/formatTime';
import toast from '../utils/toast';

import Loader from '../components/Loader'
import {get, put } from '../services/requests';
// import Calendar from '../layouts/dashboard/Calendar';

export default function Slots() {
    
    const [slots, setSlots] = useState([]);
    const [updatedRows, setUpdatedRows] = useState([]);

    const {t} = useTranslation();

    const {currentLeague} = useContext(LeagueContext);
    const [isLoading, setIsLoading] = useState(false)


    const handleRowEditCommit = useCallback(({ id, field: col, value }) => {
      setUpdatedRows(prevRows => {
        const index = prevRows.findIndex(row => row.id === id);
        if (index > -1) {
          const updatedRow = { ...prevRows[index], changes: { [col]: value } };
          return [...prevRows.slice(0, index), updatedRow, ...prevRows.slice(index + 1)];
        } 
          const newRow = { id: id || prevRows.length + 1, changes: { [col]: value } };
          return [...prevRows, newRow];
        
      });
    }, []);
    
    
    const columns  =  [
      { 
        field: 'name',
        headerName: t('headTableNameSlots'),
        width: 500, 
        headerAlign: 'center',
        align: 'center',
        editable: true,
        onEditCellChange: handleRowEditCommit,
      },
      { 
        field: 'criado_em',
        headerName: 'Update at',
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
      
      
    const onProcessRowUpdate = async () => {
      setIsLoading(true);
      try {
        await delay(300);
        console.log(updatedRows)
        const updatePromises = updatedRows.map(async (updatedRow) => {
          const { id, changes } = updatedRow;
          const leagueId = currentLeague.id;
          console.log(changes);
          await put(`/slot/${id}`, { ...changes, leagueId });
        });
        await Promise.all(updatePromises);
        toast({
          type: 'success',
          text: 'Atualizado com sucesso!'
        });
      } catch (error) {
        console.error(error);
        toast({
          type: 'error',
          text: 'Houve um erro ao atualizar!'
        });
      } finally {
        setIsLoading(false);
        setUpdatedRows([]);
      }
    };
    
    
    
    
      
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
        onCellEditCommit={onProcessRowUpdate}
        onCellEditCommitError={handleRowError}
        onEditCellChangeCommitted={handleRowEditCommit}
      />
      
      }
      {/* <Calendar/> */}
    </Paper>
  </>
    )
}