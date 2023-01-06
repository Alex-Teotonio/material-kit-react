import { createContext, useEffect, useState } from 'react';
import propTypes from 'prop-types'
import Loader from '../components/Loader';
import api from '../services/api';
import { auth} from '../services/requests';


import i18n from '../i18n/index';
import {LANGS} from '../utils/dataComponents'

export const LeagueContext = createContext({});

export function LeagueProvider({ children }) {
    const [currentLeague, setCurrentLeague] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState(LANGS[0]);

    const [authenticated, setAuthenticated] = useState(false);
    const [restrictions, setRestrictions] = useState([])
    const [isLoadingContext, setIsloadingContext] = useState(false);
    const [dadosUser, setDadosUser] = useState('');


    const currentLeagueString = localStorage.getItem('myLeague');
    const currentLeagueStorage = JSON.parse(currentLeagueString);
    useEffect(() => {
        (async () => {
        const token = localStorage.getItem('token')
        if(token) {
          api.defaults.headers.authorization = `Bearer ${JSON.parse(token)}`;
          setAuthenticated(true)
        }
        })();
    }, []);


    async function handleRestrictions(restriction) {
      setRestrictions([...restrictions, restriction])
    }

    async function loadRestrictions() {
      const arrayData = [];
      const response = await api.get(`/ca1_league/${currentLeagueStorage.id}`);
      response.data.map((data) => arrayData.push(data));

      const response2 = await api.get(`/ca2/${currentLeagueStorage.id}`);
      response2.data.map((data) => arrayData.push(data));
  
      const response3 = await api.get(`/ca3/${currentLeagueStorage.id}`);
      response3.data.map((data) => arrayData.push(data));
  
      const response4 = await api.get(`/ca4/${currentLeagueStorage.id}`);
      response4.data.map((data) => arrayData.push(data));

      // const response5 = await api.get(`/br1/${currentLeague.id}`);
      // response5.data.map((data) => arrayData.push(data));
  
      // const response6 = await api.get(`/br2/${currentLeague.id}`);
      // response6.data.map((data) => arrayData.push(data));
  
      // const response7 = await api.get(`/fa2/${currentLeague.id}`);
      // response7.data.map((data) => arrayData.push(data));
  
      // const response8 = await api.get(`/se1/${currentLeague.id}`);
      // response8.data.map((data) => arrayData.push(data));

      setRestrictions(arrayData)
    }

    async function deleteRestriction(arrayRestrictions) {


      const token = localStorage.getItem('token');
        arrayRestrictions.map(async (restriction) => {

        await api.delete(`/${restriction.split('-')[1]}/${restriction.split('-')[0]}`)
        })
        
        const result = restrictions.filter(object => !arrayRestrictions.some(toDelete => toDelete === object.id));

        setRestrictions(result);
    }
  
    async function handleLogin(email, password) {
      // setIsloadingContext(true);
      try {
        const {data} = await auth(email, password)
        localStorage.setItem('token', JSON.stringify(data.token));
        setDadosUser({email: data.email, name: data.name})

        api.defaults.headers.authorization = `Bearer ${data.token}`;
        setAuthenticated(true);
      } catch(error) {
        throw new Error(error)
      }
        // setIsloadingContext(false);
    }

    async function saveCurrentLeague(league =29) {
        localStorage.setItem('myLeague', JSON.stringify(league));
        const leagueString = localStorage.getItem('myLeague');
        setCurrentLeague(JSON.parse(leagueString));
    }
    if(isLoadingContext) return <Loader isLoading={isLoadingContext}/>

  async function saveCurrentLanguage(languageSelected) {
    setCurrentLanguage(LANGS.find((lang) => lang.value === languageSelected));
    i18n.changeLanguage(languageSelected);
  }
    return (
        <LeagueContext.Provider
          value={{saveCurrentLeague,  currentLeague, currentLanguage, saveCurrentLanguage, handleLogin, authenticated, restrictions, handleRestrictions, loadRestrictions, deleteRestriction, dadosUser}}
        >
          {children}
        </LeagueContext.Provider>
    )

}

LeagueProvider.propTypes = {
    children: propTypes.node
}