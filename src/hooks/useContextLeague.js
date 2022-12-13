import { createContext, useEffect, useState } from 'react';
import propTypes from 'prop-types'
import Loader from '../components/Loader';
import api from '../services/api';
import { loadLeagues, auth} from '../services/requests'


import i18n from '../i18n/index';
import {LANGS} from '../utils/dataComponents'

export const LeagueContext = createContext({});

export function LeagueProvider({ children }) {
    const [leagues, setLeagues] = useState([]);
    const [currentLeague, setCurrentLeague] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState(LANGS[0]);

    const [authenticated, setAuthenticated] = useState(false);
    const [isLoadingContext, setIsloadingContext] = useState(false);

    useEffect(() => {
        (async () => {
        const token = localStorage.getItem('token')
        if(token) {
          api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
          setAuthenticated(true)
        }
        const league = await loadLeagues()
        setLeagues(league);
        setIsloadingContext(false)
        })();
    }, []);

    async function createLeague({ name, short, numberTeams, round, mirred }) {
      const response = await api.post('/league', { name, short, numberTeams, round, mirred });
      setLeagues([...leagues, response.data]);
      localStorage.setItem('myLeague', leagues);
    }


    async function changeLeague(idLeague, { name, short, numberTeams, round, mirred }) {
      await api.put(`/league/${idLeague}`, {
        name,
        short,
        numberTeams,
        round,
        mirred
      });
  
      const response = await api.get('/league');
      setLeagues(response.data);
    }
  

    async function handleLogin(email, password) {
      setIsloadingContext(true)
      const {data} = await auth(email, password)
      localStorage.setItem('token', JSON.stringify(data));

      api.defaults.headers.authorization = `Bearer ${data}`;
      setAuthenticated(true)
      setIsloadingContext(false)
    }
    async function handleLeague(){
        const league = await loadLeagues();
        setLeagues(league);
    }
    async function saveCurrentLeague(league =29) {
        localStorage.setItem('myLeague', JSON.stringify(league));
        const leagueString = localStorage.getItem('myLeague');
        setCurrentLeague(JSON.parse(leagueString));
    }

    async function deleteLeague(idLeague) {
      await api.delete(`/league/${idLeague}`);
      const leaguesFilter = leagues.filter((league) => league.id !== idLeague);
      setLeagues(leaguesFilter);
    }

    if(isLoadingContext) return <Loader isLoading={isLoadingContext}/>

  async function saveCurrentLanguage(languageSelected) {
    setCurrentLanguage(LANGS.find((lang) => lang.value === languageSelected));
    i18n.changeLanguage(languageSelected);
  }
    return (
        <LeagueContext.Provider
          value={{createLeague,saveCurrentLeague, changeLeague, deleteLeague,leagues, currentLeague, currentLanguage, saveCurrentLanguage, handleLogin, authenticated, isLoadingContext, handleLeague}}
        >
          {children}
        </LeagueContext.Provider>
    )

}

LeagueProvider.propTypes = {
    children: propTypes.node
}