import {useEffect, useState , useContext } from 'react'
import {Button, Card, Container, TableContainer, Table, TableBody, TableRow, TableCell,Typography, Checkbox } from '@mui/material';
import Scrollbar from '../components/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import {fDateTime} from '../utils/formatTime';
import ListTeams from '../components/ListTeams'


import { LeagueContext } from '../hooks/useContextLeague';

import Modal from '../components/ModalRestrictions'

export default function Restrictions() {
    const TABLE_HEAD = [
        { id: 'categoty', label: 'Categoria', alignRight: false },
        { id: 'type', label: 'Tipo', alignRight: false },
        { id: 'penality', label: 'Penalidade', alignRight: false },
        { id: 'Aplica', label: 'Aplica a', alignRight: false },
        { id: 'criado_em', label: 'Criado em', alignRight: false },
        { id: '' },
    ]

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isItemSelected, setIsItemSelected] = useState(false);
    const [newSelected, setNewSelected] = useState({});
    const {restrictions , loadRestrictions, deleteRestriction} = useContext(LeagueContext)
    useEffect(
        () => {
            async function loadData() {
                await loadRestrictions();
            }
            loadData()
        },
        []
    )
    const handleClickButton = () => {
        setIsOpenModal(true)
    }
    const handleClick = (event, row) => {
        const {type_constraint:type} = row
        const {id} = row
        setNewSelected(
            {
            id,
            type
        })

        setIsItemSelected(!isItemSelected)
    }

    const handleClickButtonDelete = async () => {
        await deleteRestriction(newSelected);
    }

    const handleClose = () => {
        setIsOpenModal(false)
    }
    return (
        <Container>
            <Modal isOpen={isOpenModal} onRequestClose={handleClose}/>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead headLabel={TABLE_HEAD}/>
                            <TableBody> 
                                {restrictions.map((row) => (
                                        <TableRow
                                            hover
                                            key={row.id}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={newSelected.id === row.id} onChange={(event) => handleClick(event, row)} />
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.type_constraint}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.type}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.penalty}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="subtitle2" noWrap>
                                                    <ListTeams constraintId={row.id} constraintType={row.type_constraint}/>
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="left">
                                                <Typography variant="subtitle2" noWrap>
                                                    {fDateTime(row.criado_em)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>

                            {restrictions.length === 0 && (
                            <TableBody>
                                <TableRow>
                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                <Typography gutterBottom align="center" variant="subtitle1">
                                    No restrictions registered
                                </Typography>
                                </TableCell>
                                </TableRow>
                            </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <Button 
                    disabled ={!isItemSelected}
                    variant="outlined"
                    sx={{float: 'right', margin: '10px' }}
                    onClick={handleClickButtonDelete}
                >
                    Deletar
                </Button>                                
                <Button variant="outlined" sx={{float: 'right', margin: '10px' }} onClick={handleClickButton}>Adicionar</Button>
            </Card>
        </Container>
    );
}