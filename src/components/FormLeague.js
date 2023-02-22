import {useState, useContext} from 'react';
import * as Yup from 'yup';
import {Box,Button, Card, Container, MenuItem, Select, TextField} from '@mui/material';
import propTypes from 'prop-types'
import api from '../services/api';
import {put} from '../services/requests';
import toast from '../utils/toast';

import { LeagueContext } from '../hooks/useContextLeague';


export default function Form({onRequestClose, onHandleLeague, data = ''}) {

    const [name, setName] = useState(data.name? data.name: '');
    const [short, setShort] = useState(data.short? data.short: '');
    const [numberTeams, setNumberTeams] = useState(data.number_teams? data.number_teams: '');
    const [round, setRound] = useState(data.roud_robin? data.roud_robin: 10);
    const [mirred, setMirred] = useState(10);


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        short: Yup.string().required('Campo obrigatório'),
        numberTeams: Yup.number().required('Campo obrigatório').positive('Digite um número positivo').integer('Digite um número inteiro'),
        mirred: Yup.number().required('Campo obrigatório')
    });

    const {setValueStatusSolution} = useContext(LeagueContext)

    async function createLeague({ name, short, numberTeams, mirred }) {
        const {data} =  await api.post('/league', { name, short, numberTeams, mirred });
        return data;
    }

    async function changeLeagues(idLeague, { name, short, numberTeams, round, mirred }) {
        try {
            const payload = { name, short, numberTeams, round, mirred }
            const {data: newUpdateLeague} = await put(`/league/${idLeague}`, payload)
            setValueStatusSolution('outdated');
            return newUpdateLeague;
        } catch(e) {
            return e;
        }
    }
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!data) {
            try{
                await validationSchema.validate({name, short, numberTeams, mirred});
                const league = await createLeague({name, short, numberTeams, round, mirred})
                setName('');
                setShort('');
                setRound(10);
                setNumberTeams(0)
                setMirred(10);
                onHandleLeague(league)
                onRequestClose();
            } catch(error) {
                toast({
                  type: 'error',
                  text: error.message
                })
            }
        } else {
            try{
                await validationSchema.validate({name, short, numberTeams, mirred});
                const currentLeagueString = localStorage.getItem('myLeague');
                const currentLeague = JSON.parse(currentLeagueString);
                const league = await changeLeagues(currentLeague.id, { name, short, numberTeams, round, mirred });
                onHandleLeague(league)
                onRequestClose();
            } catch(error) {
                toast({
                  type: 'error',
                  text: 'Houve um erro ao cadastrar a restrição'
                })
            }
        }
    }
    return (
        <Container sx={{display: 'flex'}} >
            <Card sx = {{padding: '25px 25px', width:"1024px"}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}} component="form" onSubmit={handleSubmit}>
                    <TextField 
                        id="name"
                        label="League"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField 
                        label="Short" 
                        sx={{marginTop: '10px'}}
                        value={short}
                        onChange={(event) => setShort(event.target.value)}
                    />
                    <TextField 
                        label="NºTeams"
                        type="number" 
                        sx={{marginTop: '10px'}}
                        value={numberTeams}
                        onChange={(event) => setNumberTeams(event.target.value)}
                    />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Mirred"
                        placeholder="Mirred"
                        defaultValue={10}
                        value={mirred}
                        onChange={(event) => setMirred(event.target.value)}
                        sx={{marginTop: '15px', marginBottom: '20px'}}
                    >
                        <MenuItem value={10}>Yes</MenuItem>
                        <MenuItem value={20}>No</MenuItem>
                    </Select>

                    <Button variant="contained" sx={{padding:'4px', height: '40px', marginTop: '20px'}} type="submit">Cadastrar Liga </Button>
                </Box>
            </Card>
        </Container>
    );
}

Form.propTypes = {
    onHandleLeague: propTypes.func,
    onRequestClose: propTypes.func,
    data: propTypes.object
}