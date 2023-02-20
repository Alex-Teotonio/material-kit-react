import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  FormGroup,
  FormHelperText,
  Select,
  MenuItem
} from '@mui/material';
import { makeStyles } from "@material-ui/styles";
import * as Yup from 'yup';
import {post,get} from '../services/requests';

const validationSchema = Yup.object().shape({
  teamshome: Yup.string().required('Campo obrigatório'),
  teamsaway: Yup.string().required('Campo obrigatório'),
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 2,
    minWidth: 220,
  },
  formGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '16px',
    alignItems: 'center',
  },
  textField: {
    marginRight: 2,
  },
}));

const GameModal = ({ open, onClose, onSave }) => {

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);
  const leagueId = currentLeague.id
  const [formValues, setFormValues] = useState({ teamshome: '', teamsaway: '', leagueId});
  const [teams, setTeams] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const classes = useStyles();


  useEffect(() => {
    async function loadData() {
      const response = await get(`/team/${currentLeague.id}`);
      setTeams(response)
    }
    loadData()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      const savedGame = await post('/games', formValues);
      onSave(savedGame);
      setFormValues({ teamshome: '', teamsaway: '' });
      onClose();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Jogo</DialogTitle>
      <DialogContent>
        <FormGroup className={classes.formGroup}>
          <FormControl className={classes.formControl}>
            <InputLabel id="teamshome-label">Time da casa</InputLabel>
            <Select
              labelId="teamshome-label"
              id="teamshome"
              name="teamshome"
              value={formValues.teamshome}
              onChange={handleInputChange}
              error={!!formErrors.teamshome}
            >
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
              ))}
            </Select>
            {formErrors.teamshome && <FormHelperText error>{formErrors.teamshome}</FormHelperText>}
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="teamsaway-label">Time de fora</InputLabel>
            <Select
              labelId="teamsaway-label"
              id="teamsaway"
              name="teamsaway"
              value={formValues.teamsaway}
              onChange={handleInputChange}
              error={!!formErrors.teamsaway}
            >
              
              {teams.map(team => (
          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
        ))}
      </Select>
      {formErrors.teamsaway && <FormHelperText error>{formErrors.teamsaway}</FormHelperText>}
    </FormControl>
  </FormGroup>
</DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameModal;
