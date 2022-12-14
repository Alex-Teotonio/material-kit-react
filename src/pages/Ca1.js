import {useEffect, useState } from 'react'
import {Button, Card, Container, TableContainer, Table, TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
import Scrollbar from '../components/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import Modal from '../components/ModalRestrictions'

export default function Ca1() {
    const TABLE_HEAD = [
        { id: 'categoty', label: 'Categoria', alignRight: false },
        { id: 'type', label: 'Tipo', alignRight: false },
        { id: 'penality', label: 'Penalidade', alignRight: false },
        { id: 'Aplica', label: 'Aplica a', alignRight: false },
        { id: 'criado_em', label: 'Criado em', alignRight: false },
        { id: '' },
    ]

    const [isOpenModal, setIsOpenModal] = useState(false)
    useEffect(
        () => {
            async function loadData() {
                // 
            }
            loadData()
        },
        []
    )


    const handleClickButton = () => {
        setIsOpenModal(true)
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
                                <TableRow>
                                    <TableCell padding="checkbox">
                                    <Checkbox/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <Button variant="outlined" sx={{float: 'right', margin: '10px' }} onClick={handleClickButton}>Adicionar</Button>
            </Card>
        </Container>
    );
}