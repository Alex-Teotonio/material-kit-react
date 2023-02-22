import { Box, Button, Card, Container, MenuItem, Select, TextField } from '@mui/material';
import PropTypes from 'prop-types';

import api from '../services/api';
import { useLeagueForm } from '../hooks/useLeagueForm';

export default function AddLeagueForm({ onRequestClose, onHandleLeague }) {
  const initialValues = {
    name: '',
    short: '',
    numberTeams: 0,
    mirred: 10
  };
  const { values, errors, handleChange, validate } = useLeagueForm(initialValues);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {

        console.log(values)
        const { data } = await api.post('/league', values);
        onHandleLeague(data);
        onRequestClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container sx={{ display: 'flex' }}>
      <Card sx={{ padding: '25px 25px', width: '1024px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }} component="form" onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            label="League"
            name="name"
            value={values.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={handleChange}
          />
          <TextField
            label="Short"
            name="short"
            sx={{ marginTop: '10px' }}
            value={values.short}
            error={!!errors.short}
            helperText={errors.short}
            onChange={handleChange}
          />
          <TextField
            label="NºTeams"
            type="number"
            name="numberTeams"
            sx={{ marginTop: '10px' }}
            value={values.numberTeams}
            error={!!errors.numberTeams}
            helperText={errors.numberTeams}
            onChange={handleChange}
          />
          
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Mirred"
            name="Mirred"
            placeholder="Mirred"
            defaultValue={10}
            onChange={handleChange}
            sx={{marginTop: '15px', marginBottom: '20px'}}
            value={values.mirred}
            error={!!errors.mirred}
            helperText={errors.mirred}
          >
            <MenuItem value={10}>Yes</MenuItem>
            <MenuItem value={20}>No</MenuItem>
          </Select>
          <Button 
            variant="contained"
            sx={{padding:'4px', height: '40px', marginTop: '20px'}}
            type="submit"
          >
            Cadastrar Liga
          </Button>
        </Box>
      </Card>
    </Container>
  )
  }


  AddLeagueForm.propTypes = {
    onRequestClose: PropTypes.func.isRequired, 
    onHandleLeague: PropTypes.func.isRequired
  }