import {useEffect, useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {Avatar, Grid, Button,Dialog as MuiDialog, DialogTitle, Paper, ButtonGroup,Stack, Typography, DialogContent, DialogActions} from '@mui/material';
import {useTranslation} from 'react-i18next'
import {DeleteOutline, AddCircle,NotInterested,Visibility,Help,FileCopyOutlined} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid';

import api from '../services/api';
import {loadTeams} from '../services/requests'

import setRandomColor from '../components/color-utils/ColorsAleatory'
import Dialog from '../components/Dialog';


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions';

export default function Restrictions() {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [restrictionsSelected, setRestrictionsSelected] = useState([])
    const [restrictionsSelected2, setRestrictionsSelected2] = useState([])
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
            renderCell: (cellValues) => (
                <div>
                    <ButtonGroup>
                        <Button 
                            variant="string"
                            color="primary"
                            onClick={(event) => {
                                event.stopPropagation()
                                handleClickGroup1(cellValues.row)
                            }}
                            endIcon={<Visibility/>}
                        >
                            Exibir
                        </Button>
                    </ButtonGroup>
                </div>
              ),
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

        
    const handleClickGroup1 = (params) => {
        let arrayTeamsRestrictions = []; 
        let arrayTeamsRestrictions2 = []
        if(params.teams.split(';').length > 0){
            arrayTeamsRestrictions = params.teams.split(';').map((value) => teams.find((team) => parseInt(value,10) === team.id))
        }

        if(params.teams2 && params.teams2.split(';').length > 0){
            arrayTeamsRestrictions2 = params.teams2.split(';').map((value) => teams.find((team) => parseInt(value,10) === team.id))
        }
        setRestrictionsSelected(arrayTeamsRestrictions)
        setRestrictionsSelected2(arrayTeamsRestrictions2)
        setAnchorEl(true);
    }
    const handleCloseGroup1 = () => {
    setAnchorEl(false);
    };
    const handleDeleteLeague = () => {
        handleClickButtonDelete()
    }

    const handleClose = () => {
        setIsOpenModal(false)
    }
    const handleRowClick = (params) => {
        navigate(`/dashboard/${params.row.type_constraint.toLowerCase()}/${params.row.idconstraint}`)
    }
    return (
        <>
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
                <>
                <Button 
                    variant="contained"
                    sx={{
                        float: 'right',
                        margin: '10px',
                        height: '30px',
                        marginTop:'20px',
                        backgroundColor: theme.palette.error.main
                    }}
                    onClick={() => setOpenDialog(true)}
                    startIcon={<DeleteOutline/>}
                >
                    {t('buttonDelete')}
                </Button>
                </>
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
                disabled={newSelected.length > 0}
            >
                {t('buttonAdd')}
            </Button>
        </Paper>
{/*  */}
        <MuiDialog onClose={handleCloseGroup1} open={anchorEl}>
            <DialogTitle sx={{textAlign: 'center', marginBottom: '20px'}}>
                <ButtonGroup fullWidth variant="outlined">
                    <Button endIcon={<NotInterested/>}>Aplica a</Button>
                    <Button size="small" sx={{width: '35px'}} endIcon={<Help/>} />
                </ButtonGroup>
            </DialogTitle>
            <DialogContent style={{minWidth: '400px'}}>
                <Grid container spacing={restrictionsSelected2.length > 0 ? 17 : 0}>
                
                    <Grid container item xs={restrictionsSelected2.length > 0 ? 6 : 12} direction="column" justifyContent="center">
                        <Typography variant='subtitle1' align="center" gutterBottom>Teams-Gp1</Typography>
                        {
                            restrictionsSelected.map((value) => (
                                <Stack direction="row" key={value.id} alignItems="center" spacing={1} justifyContent="center">
                                <Avatar
                                    key={value?.id}
                                    src={value?.url}
                                    children={<small>{value?.initials}</small>}
                                    sx={{margin: '10px 0px'}}
                                />
                                <Typography>{value.name}</Typography>
                                </Stack>
                            ))
                        }
                    </Grid>
                
                { 
                
                restrictionsSelected2.length  > 0 && 
                <>                 
                    <Grid container item xs={6} direction="column">
                    <Typography variant='subtitle1' align="center" gutterBottom>Teams-Gp2</Typography>
                    {
                        restrictionsSelected2.map((value) => (
                            <Stack direction="row" key={value.id} alignItems="center" spacing={1} justifyContent="center">
                            <Avatar
                                key={value?.id}
                                src={value?.url}
                                children={<small>{value?.initials}</small>}
                                sx={{margin: '10px 0px'}}
                            />
                            <Typography align='center'>{value.name}</Typography>
                            </Stack>
                        ))
                    }
                    </Grid>
                </>
                }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseGroup1}>
                    Fechar
                </Button>
            </DialogActions>
            
        </MuiDialog>
        </>

    );
}