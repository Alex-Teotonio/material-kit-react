import {useState} from 'react';
import propTypes from 'prop-types'
import { Box, Card, Container, Button, TextField} from '@mui/material';
import api from '../services/api'

import {fDate} from '../utils/formatTime'

export default function FormSlots({onRequestCloseModal, data, onHandleSlots}) {

    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeague = JSON.parse(currentLeagueString);

    const [name, setName] = useState(data.title);
    const [date, setDate] = useState(fDate(data.date));
    const leagueId = currentLeague.id
    const {id} = data
    const handleChangeSlots = async(e) => {
        e.preventDefault();
        const dataHora = new Date(date)
        await api.put(`/slot/${id}`, { name, leagueId, dataHora });
        onHandleSlots();
        onRequestCloseModal();
    }
    return (

        <Container sx={{display: 'flex'}} >
            <Card sx = {{padding: '25px 25px', width:"1024px"}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}} component="form" onSubmit={handleChangeSlots}>
                    <TextField label="Name" value={name}  sx={{marginTop: '10px'}} onChange={(e)=> setName(e.target.value)}/>
                    <TextField type="date" value={date}  sx={{marginTop: '10px'}} onChange={(e)=> setDate(e.target.value)}/>
                    <Button type="submit"  sx={{marginTop: '10px'}}>Update</Button>
                </Box>
            </Card>
        </Container>
    )
}

FormSlots.propTypes = {
    onRequestCloseModal: propTypes.func,
    onHandleSlots: propTypes.func,
    data: propTypes.object
}