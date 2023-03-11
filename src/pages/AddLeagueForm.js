
import { useTranslation } from 'react-i18next'; 
import { 
  Box,
  Button,
  Card,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import {Warning} from '@mui/icons-material'

import api from '../services/api';
import { useLeagueForm } from '../hooks/useLeagueForm';

export default function AddLeagueForm({ onRequestClose, onHandleLeague }) {
  const {t} = useTranslation()
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
        const { data } = await api.post('/league', values);
        onHandleLeague(data);
        onRequestClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', backgroundColor: '#FFF7CD', }}>
      <Warning sx={{ color: '#F6C244', margin: '5px 5px' }} />
      <Typography variant="body2" sx={{color: '#FFC107', padding: '5px'}}>
        {t('informationLeague')}
      </Typography>
      </Box>
      <Card sx={{ padding: '25px 25px', width: '100%' }}>
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
            label={t('headTableShort')}
            name="short"
            sx={{ marginTop: '10px' }}
            value={values.short}
            error={!!errors.short}
            helperText={errors.short}
            onChange={handleChange}
          />
          <TextField
            label={t('headTableNumberTeams')}
            type="number"
            name="numberTeams"
            sx={{ marginTop: '10px' }}
            value={values.numberTeams}
            error={!!errors.numberTeams}
            helperText={errors.numberTeams}
            onChange={handleChange}
          />
        <InputLabel 
          id="demo-simple-select-label"
          sx={{ 
            fontSize: 'small',
            marginTop: '16px',
            marginBottom: '0px'
          }}>
            {t('labelMirred')}
        </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="mirred"
            placeholder={t('labelMirred')}
            defaultValue={10}
            onChange={handleChange}
            sx={{ marginTop: '2px', marginBottom: '20px' }}
            value={values.mirred}
            error={!!errors.mirred}
            helperText={errors.mirred}
          >
            <MenuItem value={10}>{t('valueYes')}</MenuItem>
            <MenuItem value={20}>{t('valueNo')}</MenuItem>
          </Select>
          <Button 
            variant="contained"
            sx={{padding:'4px', height: '40px', marginTop: '20px'}}
            type="submit"
          >
            {t('buttonAdd')}
          </Button>
        </Box>
      </Card>
    </>
  )
  }


  AddLeagueForm.propTypes = {
    onRequestClose: PropTypes.func.isRequired, 
    onHandleLeague: PropTypes.func.isRequired
  }