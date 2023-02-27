import { useEffect, useContext, useState } from 'react';
import { makeStyles, useTheme } from "@material-ui/styles";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LeagueContext } from '../hooks/useContextLeague';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
      margin: '8px',
      border: 0,
      background: 'transparent',
      '& .MuiInputLabel-formControl': {
        fontSize: '18px',
        color: '#fff',
        fontWeight: 'bold'

      }
    }
  }
}))

export default function SelectSmall() {
  const { leaguesToUser, saveCurrentLeague, currentLeague } = useContext(LeagueContext)
  const [age, setAge] = useState('');
  const classes = useStyles();
  const theme = useTheme();

  const handleChange = (event) => {
    const { value } = event.target;
    const league = leaguesToUser.find((f) => f.id === value);
    saveCurrentLeague(league);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 260, margin: 0 }} size="small" className={classes.root} style={{ backgroundColor: 'transparent' }}>
      <InputLabel id="demo-select-small" style={{ color: '#fff' }}>League</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={currentLeague.id}
        label="League"
        onChange={handleChange}
        variant="outlined"
        style={{ backgroundColor: 'transparent', color: '#fff' }}
      >
        {
          leaguesToUser.length > 0 && leaguesToUser.map((l) => (
            <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}
