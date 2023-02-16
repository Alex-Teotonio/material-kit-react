import {useEffect, useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {Avatar, Button, Paper, ButtonGroup, Popover, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next'
import {DeleteOutline, AddCircle,NotInterested} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {GridActionsCell} from  '@mui/x-data-grid';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid';
import MuiAccordion from '../components/Accordion';

import api from '../services/api';
import {loadTeams} from '../services/requests'

import setRandomColor from '../components/color-utils/ColorsAleatory'
import Dialog from '../components/Dialog';


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions'

export default function Restrictions() {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElGp, setAnchorElGp] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [newSelected, setNewSelected] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const {restrictions , loadRestrictions, deleteRestriction} = useContext(LeagueContext);
    const [teams, setTeams] =  useState([]);
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);

    const theme = useTheme()
    useEffect(
        () => {
            async function loadData() {
                const token = localStorage.getItem('token')
                if(token) {
                    api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
                }
                await loadRestrictions();
                const data = await loadTeams(currentLeague.id);
                setTeams(data)
            }
            loadData()
        },
        []
    )
    const handleClickButton = () => {
        setIsOpenModal(true)
    }
    const handleClick = (arrayRestrictions) => {
        setNewSelected(arrayRestrictions)
    }

    const columns = [
        { 
            field: 'type_constraint',
            headerName: t('headTableCategory'),
            width: 80,
            align: 'center',
            headerAlign: 'center',
            disableClickEventBubbling: true
        },
        { field: 'type', headerName: t('headTableType'), width: 90, align: 'center',headerAlign: 'center' },
        { field: 'penalty', headerName: t('headTablePenalty'), width: 90 , align: 'center',headerAlign: 'center'},
        {
            field: 'teams',
            headerName: 'Aplica a',
            renderCell: (cellValues) => {
        
              const handleClickGroup1 = (event) => {
                event.stopPropagation();
                setAnchorEl(event.currentTarget);
              };

        
              const handleCloseGroup1 = () => {
                setAnchorEl(null);
              };

              const handleClickGroup2 = (event) => {
                event.stopPropagation();
                setAnchorElGp(event.currentTarget);
              };

              const handleCloseGroup2 = () => {
                setAnchorElGp(null);
              };
        
              const open = Boolean(anchorEl);
              const openGp = Boolean(anchorElGp);
        
              return (
                <div>
                  <ButtonGroup>
                    <Button variant="contained" onClick={handleClickGroup1}>Times-Gp1</Button>
                    <Button  variant="outlined" onClick={handleClickGroup2}>Times-Gp2</Button>
                  </ButtonGroup>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseGroup1}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Typography>
                      <ul>
                        {
                            cellValues.row.teams.split(';').length > 0 && cellValues.row.teams.split(';').map((value) => {
                                const teamFind = teams.find((team) => parseInt(value,10) === team.id)
                                console.log('into Popover 1', teamFind);
                                console.log('into Popover 2', cellValues.row.id, cellValues.row.teams);
                                return (
                                    <li key={teamFind?.id}>
                                        <Avatar 
                                        sx={{marginRight: '3px' ,backgroundColor: setRandomColor()}}
                                        key={teamFind?.id}
                                        src={teamFind?.url}
                                        sizes="30"
                                        children={<small>{teamFind?.initials}</small>}
                                        />
                                    </li>
                                )
                            })
                         }
                      </ul>
                    </Typography>
                  </Popover>

                  <Popover
                    open={openGp}
                    anchorEl={anchorElGp}
                    onClose={handleCloseGroup2}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Typography>
                      <ul>
                        <li>Teste2</li>
                        {/* {
                            cellValues.row.teams.split(';').length > 0 && cellValues.row.teams.split(';').map((value) => (
                                <li key={value.id}>{value.name}</li>
                            ))
                         } */}
                      </ul>
                    </Typography>
                  </Popover>
                </div>
              );
            },
            width: 400,
            align:'center',
            headerAlign: 'center'
          },
        { field: 'criado_em', headerName: t('headTableCreated'), width: 250, headerAlign: 'center', align: 'center' },
    ];


    const handleClickButtonDelete = async () => {
        try {
            setOpenDialog(false)
            await deleteRestriction(newSelected);
            toast({
                type: 'success',
                text: 'Instância deletada com sucesso!'
            })
        }catch(e) {
            toast({
                type: 'error',
                text: 'Houve um erro durante a operação'
            })
        }
    }

    const handleDeleteLeague = () => {
        handleClickButtonDelete()
    }

    const handleClose = () => {
        setIsOpenModal(false)
    }

    const handleCellClick = (event) => {
        alert('here')
    }
    const handleRowClick = (params) => {
        navigate(`/dashboard/${params.row.type_constraint.toLowerCase()}/${params.row.idconstraint}`)
    }
    return (
        <Paper elevation={3} square sx={{width: '100%', padding: '5px'}} >
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button startIcon={<NotInterested/>}>Restrições</Button>
          </ButtonGroup>
        <Modal isOpen={isOpenModal} onRequestClose={handleClose}/>
        <Dialog 
            open={openDialog}
            title="Alerta"
            contentMessage=' A instância será excluída permanentemente.Deseja continuar?'
            onClickAgree={handleDeleteLeague}
            onClickDisagree={() => setOpenDialog(false)}
        />
            <DataGrid
                columnData={columns}
                rowsData={restrictions}
                onHandleCheckbox={handleClick}
                onHandleRowClick={handleRowClick}
            />
            { newSelected.length > 0 && (
                <Button 
                    variant="contained"
                    sx={{float: 'right', margin: '10px',backgroundColor: theme.palette.error.main }}
                    onClick={() => setOpenDialog(true)}
                    startIcon={<DeleteOutline/>}
                >
                    {t('buttonDelete')}
                </Button>
            )}
            <Button
                endIcon={<AddCircle/>}
                variant="contained" 
                sx=
                {{
                    marginTop:'20px',
                    height: '30px',
                    float: 'right',
                    marginRight: '4px'
                }}
                onClick={handleClickButton}
            >
                {t('buttonAdd')}
            </Button>

        </Paper>
    );
}