import 'regenerator-runtime/runtime';

import { useEffect, useState,Fragment, useContext } from 'react';

import {Box,Button,ButtonGroup,IconButton,Modal,Paper,Stack, TextField, Typography } from '@mui/material';
import { AccessTimeTwoTone, Edit } from "@mui/icons-material";
import {useTranslation} from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { LeagueContext } from "../hooks/useContextLeague";
import {fDate, delay } from '../utils/formatTime'
import toast from '../utils/toast';
import TutorialCarousel from '../components/Carousel';


import Loader from '../components/Loader'
import {get, put } from '../services/requests';
// import Calendar from '../layouts/dashboard/Calendar';

export default function Slots() {
    
    const [slots, setSlots] = useState([]);

    const {t} = useTranslation();

    const {currentLeague} = useContext(LeagueContext);
    const [isLoading, setIsLoading] = useState(false);
    const [editedSlot, setEditedSlot] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 650,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
    

    
    const columns  =  [
      { 
        field: 'name',
        headerName: t('headTableNameSlots'),
        width: 600, 
        headerAlign: 'center',
        align: 'center',
        editable: true
      },
      { 
        field: 'criado_em',
        headerName: 'Update at',
        width: 500, 
        headerAlign:'center',
        align: 'center' 
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 300,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <IconButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            <Edit/>
          </IconButton>
        )
      }
    ];

    useEffect(() => {
      async function fetchData() {
        const data = await get(`/slot/${currentLeague.id}`);
        setSlots(data)
      }
  
      fetchData();
    }, [currentLeague.id]);
    const saveChanges = async (slot) => {
      try {
        setIsLoading(true);
        await delay(300)
        const data = {
          name: slot.name,
          leagueId: currentLeague.id
        }
        const response = await put(`/slot/${slot.id}`, data);
        const updatedSlot = response.data

        setSlots((prevSlots) =>
          prevSlots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s))
        );
        setOpenModal(false);
        toast({
          text: "Slot atualizado com sucesso!",
          type: 'success'
        });
      } catch (error) {
        toast({
          text: "Erro ao atualizar o slot!",
          type: 'error'
        });
        setIsLoading(false)
      } finally{
        setIsLoading(false)
      }
    };

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEditedSlot((prevSlot) => ({ ...prevSlot, [name]: value }));
    };
    
    
    const handleEdit = (row) => {
      console.log(row)
      console.log(`Editar ${row}`);
      setSelectedSlot(row);
      setEditedSlot(row);
      setOpenModal(true);
    };
    
    
    
    return (
      <>
        <Paper square sx={{width: '100%', padding: '5px', height:'400px'}} >
          <Loader isLoading={isLoading} />
          
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button startIcon={<AccessTimeTwoTone/>}>{t('headTableNameSlots')}</Button>
          </ButtonGroup>
          {slots && slots.length > 0 &&
            <DataGrid
              columns={columns}
              rows={slots}
              getRowId={(row) => row.id ? row.id : ""}
            />
          }
        </Paper>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={style}>
          <Stack direction='row' alignItems='center' justifyContent='center' mb={1} >
              <Typography
                 variant='h4'
                 justifyContent='center'
                 alignItems='center'
                 mr={1}
                 color='primary'
              >
                {t('headTableNameSlots')}
              </Typography>
              <AccessTimeTwoTone color='primary' style={{ fontSize: 24 }} />
          </Stack>
          <Box sx={{ marginTop: "8px", marginBottom: '8px' }}>
            <Typography
              variant='body1'
              justifyContent='center'
              alignItems='center'
              sx={{backgroundColor:'#D1E9FC', color:'#2065D1' }}
              p={1}
              fontWeight='bold'
            >
              {
                t('messageSlots')
              }
            </Typography>
          </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <TextField
                fullWidth
                required
                type="text"
                name="name"
                value={editedSlot?.name || ""}
                onChange={handleInputChange}
                error={!editedSlot?.name}
                helperText={!editedSlot?.name && t("fieldRequired")}
              />
            </Box>
            <Stack direction="row" justifyContent="flex-end">
          <Button onClick={() => setOpenModal(false)}>{(t('buttonCancel'))}</Button>
          <Button onClick={() => saveChanges(editedSlot)} variant="contained" color="primary">
          Salvar
          </Button>
          </Stack>

          </Box>
        </Modal>
      </>
    );
    
}
