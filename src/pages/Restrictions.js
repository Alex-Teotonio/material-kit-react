import {useEffect, useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {Avatar, Button, Card, Container} from '@mui/material';
import {useTranslation} from 'react-i18next'
import {DeleteOutline} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from '../utils/toast';
import DataGrid from '../components/DataGrid';

import api from '../services/api';
import {loadTeams} from '../services/requests'

import AppBar from '../components/AppBar';

import setRandomColor from '../components/color-utils/ColorsAleatory'
import Dialog from '../components/Dialog';


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions'

export default function Restrictions() {

    const {t} = useTranslation();
    const navigate = useNavigate();
    
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
        { field: 'type_constraint', headerName: t('headTableCategory'), width: 80 , align: 'center'},
        { field: 'type', headerName: t('headTableType'), width: 90, align: 'center' },
        { field: 'penalty', headerName: t('headTablePenalty'), width: 90 , align: 'center'},
        { field: t('headTableNameTeams'), renderCell: (cellValues) => {
                if(teams.length !== 0 && cellValues.row.teams.includes(';')) {
                    const renderContent = cellValues.row.teams.split(';').map((value) => {
                            const teamFind = teams.find((team) => parseInt(value,10) === team.id)
                            return (
                                <>
                                    <Avatar 
                                        sx={{marginRight: '2px' ,backgroundColor: setRandomColor()}}
                                        key={teamFind?.id}
                                        src={teamFind?.url}
                                        sizes="30"
                                        children={<small>{teamFind?.initials}</small>}
                                    />
                                </>
                            )
                    })

                    return renderContent
                } 
                    const teamFind = teams.find((team) => parseInt(cellValues.row.teams,10) === team.id)
                    return (
                        <>
                            <Avatar 
                                sx={{marginRight: '2px' ,backgroundColor: setRandomColor()}}
                                key={teamFind?.id}
                                src={teamFind?.url}
                                sizes="30"
                                children={<small>{teamFind?.initials}</small>}
                            />
                        </>
                    )   
                
        }, width: 360 },
        { field: 'criado_em', headerName: t('headTableCreated'), width: 250 }
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
        <Container maxWidth='xl'>
            <Modal isOpen={isOpenModal} onRequestClose={handleClose}/>
            <Card>
            <Dialog 
                open={openDialog}
                title="Alerta"
                contentMessage=' A instância será excluída permanentemente.Deseja continuar?'
                onClickAgree={handleDeleteLeague}
                onClickDisagree={() => setOpenDialog(false)}
            />
                <AppBar titleAppBar={t('headTableRestriction')}/>
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
                <Button variant="outlined" sx={{float: 'right', margin: '10px' }} onClick={handleClickButton}>{t('buttonAdd')}</Button>
            </Card>
        </Container>
    );
}