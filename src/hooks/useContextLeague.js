import { createContext, useEffect, useState } from 'react';
import propTypes from 'prop-types'
import api from '../services/api';

import {get, auth} from  '../services/requests'
import { useLocalStorage } from './useLocalStorage';


import i18n from '../i18n/index';
import {LANGS} from '../utils/dataComponents'

export const LeagueContext = createContext({});

export function LeagueProvider({ children }) {
    const [currentLeague, setCurrentLeague] = useLocalStorage('myLeague',{});
    const [solutionExists, setSolutionExists] = useLocalStorage('mySolution', 'not');
    const [dadosUser, setDadosUser] = useLocalStorage('myUser', {});
    const [leaguesToUser, setLeaguesToUser] = useLocalStorage('leagueUser', {});
    const [currentLanguage, setCurrentLanguage] = useState(LANGS[0]);

    const [authenticated, setAuthenticated] = useState(false);
    const [restrictions, setRestrictions] = useState([]);
    

    useEffect(() => {
        (async () => {
        const token = localStorage.getItem('token')
        if(token) {
          api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
          setAuthenticated(true);

          // Carregando ligas casdastradas para o usuário logado.
          const responseLeagues = await get(`/league_user/${dadosUser.id}`);
          setLeaguesToUser(responseLeagues);

        }
        })();
    }, []);


    async function handleAddLeaguesForUser(newLeague) {
      try {
       setLeaguesToUser([...leaguesToUser, newLeague])
      } catch(e) {
        console.log(e)
      }
    }

    async function handleLeaguesForUser(leagues) {
      try {
       setLeaguesToUser(leagues)
      } catch(e) {
        console.log(e)
      }
    }

    async function handleRestrictions(restriction) {
      setRestrictions([...restrictions, restriction])
    }

    async function loadRestrictions() {
      const arrayData = [];
      const response = await api.get(`/ca1_league/${currentLeague.id}`);
      response.data.map((data) => arrayData.push(data));

      const response2 = await api.get(`/ca2_league/${currentLeague.id}`);
      response2.data.map((data) => arrayData.push(data));
  
      const response3 = await api.get(`/ca3_league/${currentLeague.id}`);
      response3.data.map((data) => arrayData.push(data));
  
      const response4 = await api.get(`/ca4_league/${currentLeague.id}`);
      response4.data.map((data) => arrayData.push(data));

      const response5 = await api.get(`/br1_league/${currentLeague.id}`);
      response5.data.map((data) => arrayData.push(data));
  
      const response6 = await api.get(`/br2_league/${currentLeague.id}`);
      response6.data.map((data) => arrayData.push(data));
  
      const response7 = await api.get(`/fa2_league/${currentLeague.id}`);
      response7.data.map((data) => arrayData.push(data));
  
      const response8 = await api.get(`/se1_league/${currentLeague.id}`);
      console.log(response8)
      response8.data.map((data) => arrayData.push(data));

      setRestrictions(arrayData)
    }

    async function deleteRestriction(arrayRestrictions) {
        arrayRestrictions.map(async (restriction) => {

        await api.delete(`/${restriction.split('-')[1]}/${restriction.split('-')[0]}`)
        })
        
        const result = restrictions.filter(object => !arrayRestrictions.some(toDelete => toDelete === object.id));

        setRestrictions(result);
    }
  
    async function handleLogin(email, password) {
      try {
        const {data} = await auth(email, password)
        localStorage.setItem('token', JSON.stringify(data.token));
        
        setDadosUser({id: data.id,email: data.email, name: data.name})
        api.defaults.headers.authorization = `Bearer ${data.token}`;
      } catch(error) {
        throw new Error(error)
      }
    }

    async function saveCurrentLeague(league =29) {
        localStorage.setItem('myLeague', JSON.stringify(league));
        const leagueString = localStorage.getItem('myLeague');
        setCurrentLeague(JSON.parse(leagueString));
    }

  async function saveCurrentLanguage(languageSelected) {
    setCurrentLanguage(LANGS.find((lang) => lang.value === languageSelected));
    i18n.changeLanguage(languageSelected);
  }

  function setValueStatusSolution(value) {
    setSolutionExists(value)
  }
    return (
        <LeagueContext.Provider
          value={{saveCurrentLeague,  currentLeague, currentLanguage, saveCurrentLanguage, handleLogin, authenticated, restrictions, handleRestrictions, loadRestrictions, deleteRestriction, dadosUser, solutionExists, setValueStatusSolution,leaguesToUser, handleAddLeaguesForUser,handleLeaguesForUser}}
        >
          {children}
        </LeagueContext.Provider>
    )

}

LeagueProvider.propTypes = {
    children: propTypes.node
}