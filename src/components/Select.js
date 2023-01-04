import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import propTypes from 'prop-types';



import {LeagueContext} from '../hooks/useContextLeague'

import api from '../services/api'

export default function SelectAutoWidth({label}) {
  const [leagues, setLeagues] = React.useState([]);
  const [leagueSelected, setLeagueSelected] = React.useState(0)
  const {currentLeague} = React.useContext(LeagueContext);
  const currentLeagueString = localStorage.getItem('myLeague');
  const currentLeagueStorage = JSON.parse(currentLeagueString);





  React.useEffect(() => {
    async function loadInstances() {
      const token = localStorage.getItem('token')
      if(token) {
        api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
      }

      if(Object.keys(currentLeague).length !== 0) {
        setLeagueSelected(currentLeague)
      } else if(Object.keys(currentLeagueStorage).length !== 0) {
        setLeagueSelected(currentLeagueStorage)
      }
      const response = await api.get('/league');
      setLeagues(response.data);
    }
    loadInstances()

  },[]
  )


  const handleChange = (event) => {
    setLeagueSelected(event.target.value);
  };

  return (
    <div>
      <FormControl  color='primary' variant='standard' sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={() => {
              if(Object.keys(currentLeague).length !== 0) {
                return currentLeague.id
              } if(Object.keys(currentLeagueStorage).length !== 0) {
                return currentLeagueStorage.id
              }
              return null;
          }} 
          onChange={handleChange}
          autoWidth
        >
          {
            leagues.map((value)  => <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>)
          }
          </Select>
      </FormControl>
    </div>
  );
}

SelectAutoWidth.propTypes = {
  label: propTypes.string
}