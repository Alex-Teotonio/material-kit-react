import React, { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  FormGroup,
  IconButton,
  FormHelperText,
  Select,
  MenuItem,
  Paper,
  Typography
} from '@mui/material';

import {Clear, Close} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from "@material-ui/styles";
import * as Yup from 'yup';
import api from '../services/api';
import { LeagueContext } from '../hooks/useContextLeague';
import {post,get} from '../services/requests';
import toast from '../utils/toast'

const validationSchema = Yup.object().shape({
  teamshome: Yup.string().required('Campo obrigatório'),
  teamsaway: Yup.string().required('Campo obrigatório'),
});


const useStyles = makeStyles(() => ({
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
  dataGrid: {
    height: 400,
    width: '600px',
  },
  dialogPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1024px',
    margin: 0,
    height: '100%',
    maxHeight: 'calc(100vh - 64px)',
    borderRadius: 0,
  }
}));

const GameModal = ({ open, onClose, onSave,onAddGame, onDelete }) => {

  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeague = JSON.parse(currentLeagueString);

  const {teamColor, setTeamColor} = useContext(LeagueContext)
  const [games, setGames] = useState([]);
  const leagueId = currentLeague.id
  const [formValues, setFormValues] = useState({ teamshome: '', teamsaway: '', leagueId});
  const [teams, setTeams] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [deleteGameId, setDeleteGameId] = useState(null); // estado para armazenar o id do jogo a ser excluído


  const classes = useStyles();


  useEffect(() => {
    async function loadData() {
      const response = await get(`/team/${currentLeague.id}`);
      const gamesData = await get(`/games/${currentLeague.id}`);
      response.reduce((obj, team) => {
        obj[team.id] = setTeamColor(team);
        return obj;
      }, {});
      const gamesWithInitials = gamesData.map(game => ({
        ...game,
        initials: `${response.find(team => team.id === game.teamshome)?.initials} X ${response.find(team => team.id === game.teamsaway)?.initials}`
      }))
      setGames(gamesWithInitials);
      setTeams(response);
      setFormValues(prevValues => ({...prevValues, leagueId: currentLeague.id}));
    }
    loadData();
  }, []);

  const handleAddGame = (game) => {
    const teamshome = teams.find(team => team.id === game.teamshome);
    const teamsaway = teams.find(team => team.id === game.teamsaway);
    const newGame = {
      id: game.id,
      teamshome: game.teamshome,
      teamsaway: game.teamsaway,
    };
    const newGames = [...games, newGame];
    const gamesWithInitials = newGames.map(game => ({
      ...game,
      initials: `${teamshome.initials} X ${teamsaway.initials}`
    }));
    setGames(gamesWithInitials);
  };



  const getTeamAvatarUrl = (teamId) => {
    const team = teams.find(t => t.id === teamId);

    return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
    <Avatar
        sizes="20"
        style={{ backgroundColor: `${teamColor[team?.id]}` }}
        src={team?.url}
        children={<small>{team?.initials}</small>} key={team?.id}
    />
    <Typography style={{ marginLeft: 8 }}>{team?.name}</Typography>
    </div>
    )
    
  }

  const deleteButton = (params) => (
    <Button sx={{color: '#FF4842'}}startIcon={<Clear/>} onClick={() => handleDelete(params.row.id)}>Deletar</Button>
  )

  const columns = [
    {
      field: 'game',
      headerName: 'Jogo',
      width: 305,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection:'row' }}>
          {getTeamAvatarUrl(params.row.teamshome)}&nbsp;X&nbsp;{getTeamAvatarUrl(params.row.teamsaway)}
        </div>
      )
    },
    {
      field: 'delete',
      headerName: 'Ações',
      width: 205,
      align: 'center',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: deleteButton
    }
  ];
  
  const handleDelete = async (gameId) => {
    setDeleteGameId(gameId); // definir o id do jogo a ser excluído
  };
  
  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/games/${deleteGameId}`); // excluir o jogo
      const newGames = games.filter(game => game.id !== deleteGameId); // atualizar a lista de jogos
      setGames(newGames);
      setDeleteGameId(null); // redefinir o id do jogo a ser excluído
      if(response.status === 204) {
        onDelete(deleteGameId)
      }
      toast({
        type: 'success',
        text: 'Jogo deletado com sucesso!'
      });
      onClose();
    } catch (error) {
      if (error.response.status === 409){
        toast({
          type: 'error',
          text: 'Não foi possível excluir o jogo. Existem restrições vinculadas ao mesmo.'
        });
      } else {
        toast({
          type: 'error',
          text: 'Houve um erro na operação.'
        });
      }
      setDeleteGameId(null); // redefinir o id do jogo a ser excluído
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      const savedGame = await post('/games', formValues);
      handleAddGame(savedGame.data)
      setFormValues({ teamshome: '', teamsaway: '', leagueId });
      onClose();
      onAddGame(savedGame.data); // chama a função para adicionar o jogo à restrição
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
    <>
    <Dialog open={open} onClose={onClose} fullwidth maxWidth={false}>

    <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={onClose}>
    <Close />
  </IconButton>
      <DialogTitle>Gerencie seus jogos</DialogTitle>

      <Paper elevation={3} square sx={{width: '100%', padding: '15px', maxWidth: '1024px'}} >

      <DialogContent>
      <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
        <Button>Novo jogo</Button>
      </ButtonGroup>
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
  <Button onClick={handleSave} color="primary">
    Salvar
  </Button>
</DialogActions>
</Paper>
    <Paper elevation={3} square sx={{width: '100%', padding: '25px', marginBottom: '30px'}} >
      <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
        <Button>Jogos cadastrados</Button>
      </ButtonGroup>
      <DataGrid rows={games} columns={columns} className={classes.dataGrid} autoHeight
rowHeight={60}
 />
    </Paper>
    </Dialog>

      <Dialog
      open={Boolean(deleteGameId)} // exibir a caixa de diálogo de confirmação somente se houver um jogo a ser excluído
      onClose={() => setDeleteGameId(null)} // fechar a caixa de diálogo se o usuário clicar no botão de cancelar
      >
      <DialogTitle>Confirmar exclusão</DialogTitle>
      <DialogContent>
        <Typography>Deseja mesmo excluir o jogo?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteGameId(null)}>Cancelar</Button>
        <Button onClick={handleConfirmDelete} color="error">Excluir</Button>
      </DialogActions>
</Dialog>

</>
  );
};

export default GameModal;