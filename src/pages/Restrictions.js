import {useEffect, useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    AvatarGroup,
    Grid,
    Button,
    Dialog as MuiDialog,
    DialogTitle,
    Paper,
    ButtonGroup,
    Stack,
    Typography,
    DialogContent,
    DialogActions
} from '@mui/material';
import {useTranslation} from 'react-i18next'
import {DeleteOutline, AddCircle,NotInterested,Visibility,Help} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid';

import {loadTeams} from '../services/requests'

import setRandomColor from '../components/color-utils/ColorsAleatory'
import Dialog from '../components/Dialog';


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions';

export default function Restrictions() {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [newSelected, setNewSelected] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const {restrictions , loadRestrictions, deleteRestriction, teamColor, setTeamColor} = useContext(LeagueContext);
    const [teams, setTeams] =  useState([]);
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);

    const theme = useTheme()
    useEffect(
        () => {
            async function loadData() {
                await loadRestrictions();
                const data = await loadTeams(currentLeague.id);
                const colors = {}
                data.forEach(team => {
                    colors[team.id] = setTeamColor(team);
                  });
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
            width: 100,
            align: 'center',
            headerAlign: 'center',
            disableClickEventBubbling: true
        },
        { field: 'type', headerName: t('headTableType'), width: 90, align: 'center',headerAlign: 'center' },
        { field: 'penalty', headerName: t('headTablePenalty'), width: 90 , align: 'center',headerAlign: 'center'},
        { field: 'max', headerName: 'Nº Max De Jogos', width: 150 , align: 'center',headerAlign: 'center'},
        { 
          field: 'teams', 
          headerName: 'Aplica a', 
          width: 400,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
            <AvatarGroup max={params.row?.teams.length}>
              {params.row?.teams.map((t) => {
                const team = teams.find((te) => te.id === t)
                return(
                <Avatar
                    sizes="20"
                    style={{ backgroundColor: `${teamColor[team?.id]}` }}
                    src={team?.url}
                    children={<small>{team?.initials}</small>} key={team?.id}
                />
              )})}
            </AvatarGroup>
          )
        },
        { field: 'criado_em', headerName: t('headTableCreated'), width: 250, headerAlign: 'center', align: 'center' }
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
    </>

    );
}