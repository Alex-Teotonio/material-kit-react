import {useEffect, useState} from 'react'
import {Box, Card, Container, MenuItem, Select, TextField} from '@mui/material';
import { loadSlots, loadTeams } from '../services/requests';

export default function Ca1() {
    const [teams, setTeams] = useState([]);
    const [slots, setSlots] = useState([]);

    useEffect(
        () => {
            async function loadData() {
                const responseTeams = await loadTeams();
                const responseSlots = await loadSlots();

                setTeams(responseTeams);
                setSlots(responseSlots);
            }
            loadData()
        },
        []
    )
    return (
        <Container>
            <Card  sx = {{padding: '25px 25px', width:"1024px"}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}} component="form">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Equipes"
                    placeholder="Equipes"
                    sx={{marginRight: '15px', maxWidth: '250px'}}
                >
                    {
                        teams.map((team) => (
                            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                        ))
                    }
                </Select>
                <TextField label="Qtde Jogos" type="number"  sx={{marginTop: '0px 0px', maxWidth: '250px'}} />
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Mode"
                    placeholder="Mode"
                    sx={{marginRight: '15px',maxWidth: '250px'}}
                >
                    <MenuItem value='H'>Home</MenuItem>
                    <MenuItem value='A'>Away</MenuItem>
                </Select>

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Equipes"
                    placeholder="Equipes"
                    sx={{marginRight: '15px', maxWidth: '250px'}}
                >
                    {
                        slots.map((slot) => (
                            <MenuItem key={slot.id} value={slot.id}>{slot.name}</MenuItem>
                        ))
                    }
                </Select>
                <button type='submit'>Ok</button>
                </Box>

            </Card>
        </Container>
    );
}