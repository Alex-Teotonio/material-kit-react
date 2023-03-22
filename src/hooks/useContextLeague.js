import { createContext, useEffect, useState } from 'react';
import propTypes from 'prop-types'
import { useNavigate,useLocation } from "react-router-dom";
import toast from '../utils/toast';
import api from '../services/api';


import {get, auth} from  '../services/requests'
import { useLocalStorage } from './useLocalStorage';


import i18n from '../i18n/index';
import {LANGS} from '../utils/dataComponents'

export const LeagueContext = createContext({});

export function LeagueProvider({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentLeague, setCurrentLeague] = useLocalStorage('myLeague',{});
    const [solutionExists, setSolutionExists] = useLocalStorage('mySolution', 'not');
    const [dadosUser, setDadosUser] = useLocalStorage('myUser', {});
    const [leaguesToUser, setLeaguesToUser] = useLocalStorage('leagueUser', {});
    const [currentLanguage, setCurrentLanguage] = useLocalStorage('myLanguage',LANGS[0]);

    const [authenticated, setAuthenticated] = useState(false);
    const [restrictions, setRestrictions] = useState([]);
    const [teamColor, setTeamColors] = useLocalStorage("teamColors", {});
    

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

    useEffect(() => {
      i18n.changeLanguage(currentLanguage.value);
    }, [currentLanguage]);

    useEffect(() => {
      if (location.pathname.match(/\/teams|\/slots|\/restrictions|\/listSolutions/) && !currentLeague.id) {
        toast({
          type: 'error',
          text: 'Selecione uma liga'
        });
        navigate('/dashboard/app');
      }
    }, [currentLeague, location.pathname, navigate]);

    function setTeamColor(team) {
      const teamId = team.id;
      const existingColor = teamColor[teamId];
      if (existingColor) {
        return existingColor;
      } 
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setTeamColors({ ...teamColor, [teamId]: newColor });
        return newColor;
      
    }

    async function handleAddLeaguesForUser(newLeague) {
      try {
       setLeaguesToUser([...leaguesToUser, newLeague])
       setCurrentLeague(newLeague)
      } catch(e) {
        console.log(e)
      }
    }

    async function removeCurrentLeague(id) {
      if (currentLeague.id === id) {
        localStorage.removeItem("myLeague");
        setCurrentLeague({});
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
      response8.data.map((data) => arrayData.push(data));

      const response9 = await api.get(`/ga1_league/${currentLeague.id}`);
      response9.data.map((data) => arrayData.push(data));

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
        
        api.defaults.headers.authorization = `Bearer ${data.token}`;
        const responseLeagues = await get(`/league_user/${data.id}`);
        setLeaguesToUser(responseLeagues);
        setDadosUser({id: data.id,email: data.email, name: data.name});
      } catch(error) {
        throw new Error(error)
      }
    }

    async function handleLogout() {
      localStorage.removeItem('myLeague');
      localStorage.removeItem('mySolution');
      localStorage.removeItem('myUser');
      localStorage.removeItem('leagueUser');
      localStorage.removeItem('teamColors');
    
      setCurrentLeague({});
      setSolutionExists('not');
      setDadosUser({});
      setLeaguesToUser({});
      setAuthenticated(false);
      setTeamColors({})
    
      // redireciona para a página de login
      navigate('/login');
    }
    

    async function saveCurrentLeague(league =29) {
        setCurrentLeague(league);
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
          value={
            {
              saveCurrentLeague, 
              currentLeague,
              currentLanguage,
              saveCurrentLanguage,
              handleLogin,
              authenticated,
              restrictions,
              handleRestrictions,
              loadRestrictions,
              deleteRestriction,
              dadosUser,
              solutionExists,
              setValueStatusSolution,
              leaguesToUser,
              handleAddLeaguesForUser,
              handleLeaguesForUser,
              setTeamColor,
              removeCurrentLeague,
              teamColor,
              handleLogout
            }
          }
        >
          {children}
        </LeagueContext.Provider>
    )

}

LeagueProvider.propTypes = {
    children: propTypes.node
}