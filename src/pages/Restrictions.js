import {useEffect, useState , useContext } from 'react'
import {Avatar, Button, Card, Container, Stack} from '@mui/material';
import {useTranslation} from 'react-i18next'
import DataGrid from '../components/DataGrid'

import api from '../services/api';
import {loadTeams} from '../services/requests'

import AppBar from '../components/AppBar';

import setRandomColor from '../components/color-utils/ColorsAleatory'



import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions'

export default function Restrictions() {

    const {t} = useTranslation();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [newSelected, setNewSelected] = useState({});
    const {restrictions , loadRestrictions, deleteRestriction} = useContext(LeagueContext);
    const [teams, setTeams] =  useState([]);
    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);
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
        { field: 'type_constraint', headerName: t('headTableCategory'), width: 210 },
        { field: 'type', headerName: t('headTableType'), width: 210 },
        { field: 'penalty', headerName: t('headTablePenalty'), width: 210 },
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
                
        }, width: 280 },
        { field: 'criado_em', headerName: t('headTableCreated'), width: 250 }
    ];


    const handleClickButtonDelete = async () => {
            await deleteRestriction(newSelected);
    }

    const handleClickSelected = () => {
        setIsItemSelected(!isItemSelected)
    }

    const handleClose = () => {
        setIsOpenModal(false)
    }
    return (
        <Container maxWidth='xl'>
            <Modal isOpen={isOpenModal} onRequestClose={handleClose}/>
            <Card>
                <AppBar titleAppBar={t('headTableRestriction')}/>
                <DataGrid columnData={columns} rowsData={restrictions} onHandleCheckbox={handleClick} onHandleClickSelected={handleClickSelected} />
                <Button 
                    disabled ={!isItemSelected}
                    variant="outlined"
                    sx={{float: 'right', margin: '10px' }}
                    onClick={handleClickButtonDelete}
                >
                    {t('buttonDelete')}
                </Button>                                
                <Button variant="outlined" sx={{float: 'right', margin: '10px' }} onClick={handleClickButton}>{t('buttonAdd')}</Button>
            </Card>
        </Container>
    );
}