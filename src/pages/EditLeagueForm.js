import { useContext } from 'react';
import { 
  Box,
  Button,
  Card,
  Container,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LeagueContext } from '../hooks/useContextLeague';

import api from '../services/api';
import { useLeagueForm } from '../hooks/useLeagueForm';

export default function EditLeagueForm({ onRequestClose, onHandleLeague,data }) {
  const { setValueStatusSolution, currentLeague } = useContext(LeagueContext);
  const initialValues = {
    name: data.name,
    short: data.short,
    numberTeams: data.number_teams,
    mirred: data.mirred
  };
  const { values, errors, handleChange, validate } = useLeagueForm(initialValues);
  const {t} = useTranslation()

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {

        const { data } = await api.put(`/league/${currentLeague.id}`, values);
        onHandleLeague(data);
        setValueStatusSolution('outdated');
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
            disabled
          />
          <InputLabel 
          id="demo-simple-select-label"
          sx={{ 
            fontSize: 'small',
            marginTop: '16px',
            marginBottom: '0px'
          }}>
            Mirred
          </InputLabel>
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
            {t('buttonSave')}
          </Button>
        </Box>
      </Card>
    </Container>
  )
  }


  EditLeagueForm.propTypes = {
    onRequestClose: PropTypes.func.isRequired, 
    onHandleLeague: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }