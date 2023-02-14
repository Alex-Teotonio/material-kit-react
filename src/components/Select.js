import {useEffect, useContext, useState} from 'react';
import { makeStyles } from "@material-ui/styles";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LeagueContext } from '../hooks/useContextLeague';

const useStyles = makeStyles(() => ({
  root: {
   '& .MuiFormControl-root': {
     width: '70%',
     margin: '8px',
 
     '& .MuiInputLabel-formControl': {
       fontSize: '18px',
       color: '#fff'
     }
   }
  }
 }))
export default function SelectSmall() {
  const {leaguesToUser, saveCurrentLeague, currentLeague} = useContext(LeagueContext)
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    const {value} = event.target;

    const league = leaguesToUser.find((f) => f.id === value);
    saveCurrentLeague(league);
  };

  const classes = useStyles();

  return (
    <FormControl sx={{ m: 1, minWidth: 260, margin: 0 }} size="small" className={classes.root}>
      <InputLabel id="demo-select-small">Age</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={currentLeague.id}
        label="League"
        onChange={handleChange}
        variant="outlined"
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