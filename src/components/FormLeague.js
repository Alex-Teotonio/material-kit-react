import {useState} from 'react'
import {Box,Button, Card, Container, MenuItem, Select, TextField} from '@mui/material';
import propTypes from 'prop-types'
import api from '../services/api'


export default function Form({onRequestClose, onHandleLeague, data = '', onError= null}) {

        const [name, setName] = useState(data.name? data.name: '');
    const [short, setShort] = useState(data.short? data.short: '');
    const [numberTeams, setNumberTeams] = useState(data.number_teams? data.number_teams: '');
    const [round, setRound] = useState(data.roud_robin? data.roud_robin: 10);
    const [mirred, setMirred] = useState(10);

    async function createLeague({ name, short, numberTeams, round, mirred }) {
        const {data} =  await api.post('/league', { name, short, numberTeams, round, mirred });
        return data;
    }

    async function changeLeagues(idLeague, { name, short, numberTeams, round, mirred }) {
        const {data: newUpdateLeague} = await api.put(`/league/${idLeague}`, {
          name,
          short,
          numberTeams,
          round,
          mirred
        })

        return newUpdateLeague;
    }
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!data) {
            try{
                const league = await createLeague({name, short, numberTeams, round, mirred})
                setName('');
                setShort('');
                setRound(10);
                setNumberTeams(0)
                setMirred(10);
                onHandleLeague(league)
                onRequestClose();
            } catch(error) {
                onError();
            }
        } else {
            try{
                const currentLeagueString = localStorage.getItem('myLeague');
                const currentLeague = JSON.parse(currentLeagueString);
                const league = await changeLeagues(currentLeague.id, { name, short, numberTeams, round, mirred });
                onHandleLeague(league)
                onRequestClose();
            } catch(error) {
                onError();
            }
        }

    }
    return (
        <Container sx={{display: 'flex'}} >
            <Card sx = {{padding: '25px 25px', width:"1024px"}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}} component="form" onSubmit={handleSubmit}>
                    <TextField id="outlined-basic" label="League" value={name} onChange={(event) => setName(event.target.value)} />
                    <TextField label="Short"  sx={{marginTop: '10px'}} value={short} onChange={(event) => setShort(event.target.value)}/>
                    <TextField label="NºTeams" type="number"  sx={{marginTop: '10px'}} value={numberTeams} onChange={(event) => setNumberTeams(event.target.value)}/>
                    {/* <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Round Robin"
                        placeholder="Round Robin"
                        defaultValue={10}
                        value={round}
                        onChange={(event) => setRound(event.target.value)}
                        sx={{marginTop: '15px'}}
                    >
                        <MenuItem value={10}>Yes</MenuItem>
                        <MenuItem value={20}>No</MenuItem>
                    </Select>
                    */}
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
    data: propTypes.object,
    onError: propTypes.func
}